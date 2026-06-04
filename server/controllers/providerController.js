const { Worker, JobRequest, JobProvider, Rating } = require('../models');
const { haversineDistance } = require('../utils/helpers');
const { Op } = require('sequelize');

const searchWorkers = async (req, res) => {
  try {
    const { lat, lng, radius_km = 25, skill, min_rating, availability, sort_by } = req.query;
    
    let where = { is_suspended: false };
    if (availability) where.availability = availability;
    if (min_rating) where.rating_avg = { [Op.gte]: parseFloat(min_rating) };
    if (skill) {
      where[Op.or] = [
        { category: { [Op.like]: `%${skill}%` } },
        // Simple JSON search fallback for MySQL
        { skills: { [Op.substring]: skill } }
      ];
    }

    const workers = await Worker.findAll({
      where,
      attributes: { exclude: ['password_hash'] }
    });

    let results = workers;

    if (lat && lng) {
      const providerLat = parseFloat(lat);
      const providerLng = parseFloat(lng);
      
      results = workers.map(worker => {
        const workerObj = worker.toJSON();
        if (worker.lat && worker.lng) {
          workerObj.distance = haversineDistance(providerLat, providerLng, worker.lat, worker.lng);
        } else {
          workerObj.distance = Infinity;
        }
        return workerObj;
      }).filter(w => w.distance <= radius_km);
      
      if (sort_by === 'distance') {
        results.sort((a, b) => a.distance - b.distance);
      }
    }

    if (sort_by === 'rating') {
      results.sort((a, b) => b.rating_avg - a.rating_avg);
    }

    res.json({ workers: results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWorkerProfile = async (req, res) => {
  try {
    const worker = await Worker.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash'] }
    });
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json({ worker });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const postJob = async (req, res) => {
  try {
    const provider_id = req.user.id;
    const { worker_id, title, description, expected_wage, is_urgent, scheduled_at, work_location_lat, work_location_lng, work_location_address } = req.body;
    
    const job = await JobRequest.create({
      provider_id,
      worker_id,
      title,
      description,
      expected_wage,
      is_urgent,
      scheduled_at,
      work_location_lat,
      work_location_lng,
      work_location_address
    });

    // Populate for socket emission
    const fullJob = await JobRequest.findByPk(job.id, {
      include: [{ model: JobProvider, attributes: ['name', 'company_name', 'phone'] }]
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`user_worker_${worker_id}`).emit('job:new_request', fullJob);
    }

    res.status(201).json({ job, message: 'Job request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendJobToMultipleWorkers = async (req, res) => {
  try {
    const provider_id = req.user.id;
    const { worker_ids, title, description, expected_wage, is_urgent, scheduled_at, work_location_lat, work_location_lng, work_location_address } = req.body;
    
    if (!Array.isArray(worker_ids) || worker_ids.length === 0) {
      return res.status(400).json({ message: 'Provide array of worker_ids' });
    }

    const provider = await JobProvider.findByPk(provider_id, { attributes: ['name', 'company_name', 'phone'] });
    const io = req.app.get('io');

    const jobs = [];
    for (const worker_id of worker_ids) {
      const job = await JobRequest.create({
        provider_id,
        worker_id,
        title,
        description,
        expected_wage,
        is_urgent,
        scheduled_at,
        work_location_lat,
        work_location_lng,
        work_location_address
      });
      jobs.push(job);
      
      if (io) {
        const fullJob = { ...job.toJSON(), JobProvider: provider };
        io.to(`user_worker_${worker_id}`).emit('job:new_request', fullJob);
      }
    }

    res.status(201).json({ count: jobs.length, message: `Job sent to ${jobs.length} workers` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const { status } = req.query;
    let where = { provider_id: req.user.id };
    if (status) where.status = status;

    const jobs = await JobRequest.findAll({
      where,
      include: [{ model: Worker, attributes: ['id', 'name', 'photo_url', 'phone', 'rating_avg'] }],
      order: [['created_at', 'DESC']]
    });

    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const job = await JobRequest.findOne({ where: { id: req.params.id, provider_id: req.user.id } });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    job.status = status;
    if (status === 'completed') job.completed_at = new Date();
    await job.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`user_worker_${job.worker_id}`).emit('job:status_update', { jobId: job.id, status });
    }

    res.json({ message: 'Job status updated', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rateWorker = async (req, res) => {
  try {
    const { job_request_id, rating, review_text } = req.body;
    
    const job = await JobRequest.findOne({ where: { id: job_request_id, provider_id: req.user.id } });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.status !== 'completed') return res.status(400).json({ message: 'Job must be completed to rate' });

    const existingRating = await Rating.findOne({ where: { job_request_id, reviewer_id: req.user.id } });
    if (existingRating) return res.status(400).json({ message: 'You have already rated this job' });

    const newRating = await Rating.create({
      job_request_id,
      reviewer_id: req.user.id,
      reviewer_role: 'provider',
      reviewee_id: job.worker_id,
      reviewee_role: 'worker',
      rating,
      review_text
    });

    // Update worker average
    const worker = await Worker.findByPk(job.worker_id);
    const newCount = worker.rating_count + 1;
    const newAvg = ((parseFloat(worker.rating_avg) * worker.rating_count) + rating) / newCount;
    await worker.update({ rating_avg: newAvg, rating_count: newCount });

    res.status(201).json({ message: 'Rating submitted successfully', rating: newRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProviderProfile = async (req, res) => {
  try {
    const provider = await JobProvider.findByPk(req.user.id, { attributes: { exclude: ['password_hash'] } });
    res.json({ provider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProviderProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password_hash;
    delete updates.id;
    
    await JobProvider.update(updates, { where: { id: req.user.id } });
    const provider = await JobProvider.findByPk(req.user.id, { attributes: { exclude: ['password_hash'] } });
    res.json({ message: 'Profile updated', provider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProviderLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (!lat || !lng) return res.status(400).json({ message: 'lat and lng required' });
    await JobProvider.update({ lat, lng }, { where: { id: req.user.id } });
    res.json({ message: 'Location updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchWorkers,
  getWorkerProfile,
  postJob,
  sendJobToMultipleWorkers,
  getMyJobs,
  updateJobStatus,
  rateWorker,
  getProviderProfile,
  updateProviderProfile,
  updateProviderLocation
};
