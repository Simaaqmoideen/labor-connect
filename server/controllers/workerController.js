const { Worker, JobRequest, JobProvider, Rating, Location } = require('../models');
const { Op } = require('sequelize');

const getWorkerProfile = async (req, res) => {
  try {
    const worker = await Worker.findByPk(req.user.id, { attributes: { exclude: ['password_hash'] } });
    res.json({ worker });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password_hash;
    delete updates.id;
    delete updates.photo_url; // handled separately

    await Worker.update(updates, { where: { id: req.user.id } });
    const worker = await Worker.findByPk(req.user.id, { attributes: { exclude: ['password_hash'] } });
    res.json({ message: 'Profile updated', worker });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    if (!['available', 'busy', 'offline'].includes(availability)) {
      return res.status(400).json({ message: 'Invalid availability status' });
    }
    await Worker.update({ availability }, { where: { id: req.user.id } });
    res.json({ message: `Availability set to ${availability}`, availability });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    // Update worker table
    await Worker.update({ lat, lng }, { where: { id: req.user.id } });

    // Update locations table
    await Location.upsert({
      user_id: req.user.id,
      user_role: 'worker',
      lat,
      lng,
      updated_at: new Date()
    });

    res.json({ message: 'Location updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIncomingRequests = async (req, res) => {
  try {
    const jobs = await JobRequest.findAll({
      where: { worker_id: req.user.id, status: 'pending' },
      include: [{ model: JobProvider, attributes: ['id', 'name', 'company_name', 'phone', 'profile_photo'] }],
      order: [['created_at', 'DESC']]
    });
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const respondToJob = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid response' });
    }

    const job = await JobRequest.findOne({ where: { id: req.params.id, worker_id: req.user.id } });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.status !== 'pending') return res.status(400).json({ message: 'Job is no longer pending' });

    job.status = status;
    await job.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`user_provider_${job.provider_id}`).emit('job:respond', { jobId: job.id, status, workerId: req.user.id });
    }

    res.json({ message: `Job ${status}`, job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const { status } = req.query;
    let where = { worker_id: req.user.id };
    if (status) where.status = status;

    const jobs = await JobRequest.findAll({
      where,
      include: [{ model: JobProvider, attributes: ['id', 'name', 'company_name', 'phone'] }],
      order: [['created_at', 'DESC']]
    });

    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEarnings = async (req, res) => {
  try {
    const completedJobs = await JobRequest.findAll({
      where: { worker_id: req.user.id, status: 'completed' },
      attributes: ['expected_wage', 'completed_at']
    });

    let totalEarned = 0;
    let thisMonth = 0;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    completedJobs.forEach(job => {
      const wage = parseFloat(job.expected_wage) || 0;
      totalEarned += wage;
      const jobDate = new Date(job.completed_at);
      if (jobDate.getMonth() === currentMonth && jobDate.getFullYear() === currentYear) {
        thisMonth += wage;
      }
    });

    const pendingJobs = await JobRequest.count({ where: { worker_id: req.user.id, status: 'pending' } });
    res.json({ total_earnings: totalEarned, pending_jobs: pendingJobs, this_month: thisMonth });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyRatings = async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { reviewee_id: req.user.id, reviewee_role: 'worker' },
      order: [['created_at', 'DESC']]
    });
    res.json({ ratings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const photo_url = `/uploads/${req.file.filename}`;

    await Worker.update({ photo_url }, { where: { id: req.user.id } });
    res.json({ message: 'Photo uploaded successfully', photo_url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobProviders = async (req, res) => {
  try {
    const providers = await JobProvider.findAll({
      attributes: ['id', 'name', 'company_name', 'phone', 'lat', 'lng', 'address', 'is_verified'],
      where: {
        is_suspended: false,
        lat: { [Op.ne]: null },
        lng: { [Op.ne]: null }
      }
    });
    res.json({ providers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWorkerProfile,
  updateProfile,
  updateAvailability,
  updateLocation,
  getIncomingRequests,
  respondToJob,
  getMyJobs,
  getEarnings,
  getMyRatings,
  uploadPhoto,
  getJobProviders
};
