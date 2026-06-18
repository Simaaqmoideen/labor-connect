const { Worker, JobProvider, JobRequest, Rating, WorkerVerification } = require('../models');
const { paginate } = require('../utils/helpers');
const { Op } = require('sequelize');

const getAnalytics = async (req, res) => {
  try {
    const totalWorkers = await Worker.count();
    const activeWorkers = await Worker.count({ where: { availability: 'available' } });
    const totalProviders = await JobProvider.count();
    const totalJobs = await JobRequest.count();
    const completedJobs = await JobRequest.count({ where: { status: 'completed' } });
    const pendingJobs = await JobRequest.count({ where: { status: 'pending' } });
    
    // Advanced feature analytics
    const pendingVerifications = await WorkerVerification.count({ where: { status: 'pending' } });
    
    // Avg rating calculation could be complex, simplifying for demo
    const avgRatingResult = await Worker.aggregate('rating_avg', 'avg');
    const avgRating = avgRatingResult ? parseFloat(avgRatingResult).toFixed(1) : 0;

    const acceptedJobs = await JobRequest.count({ where: { status: 'accepted' } });
    const rejectedJobs = await JobRequest.count({ where: { status: 'rejected' } });

    res.json({
      total_workers: totalWorkers,
      active_workers: activeWorkers,
      total_providers: totalProviders,
      total_jobs: totalJobs,
      jobs_by_status: {
        completed: completedJobs,
        pending: pendingJobs,
        accepted: acceptedJobs,
        rejected: rejectedJobs
      },
      avg_rating: avgRating,
      pending_verifications: pendingVerifications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProviderLocations = async (req, res) => {
  try {
    const providers = await JobProvider.findAll({
      where: { is_suspended: false },
      attributes: ['id', 'name', 'company_name', 'address', 'lat', 'lng', 'is_verified']
    });
    // Only return providers that have valid coordinates
    const located = providers.filter(p => p.lat && p.lng);
    res.json({ providers: located });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWorkers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', verified, suspended } = req.query;
    const { offset, limit: parsedLimit } = paginate(page, limit);
    
    let where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { category: { [Op.like]: `%${search}%` } }
      ];
    }
    if (verified !== undefined) where.is_verified = verified === 'true';
    if (suspended !== undefined) where.is_suspended = suspended === 'true';

    const { rows, count } = await Worker.findAndCountAll({
      where,
      attributes: { exclude: ['password_hash'] },
      offset,
      limit: parsedLimit,
      order: [['created_at', 'DESC']]
    });

    res.json({ workers: rows, total: count, page: parseInt(page), pages: Math.ceil(count / parsedLimit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    // Don't allow password update here
    delete updates.password_hash;
    
    await Worker.update(updates, { where: { id } });
    res.json({ message: 'Worker updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteWorker = async (req, res) => {
  try {
    await Worker.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Worker deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProviders = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const { offset, limit: parsedLimit } = paginate(page, limit);
    
    let where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { company_name: { [Op.like]: `%${search}%` } }
      ];
    }

    const { rows, count } = await JobProvider.findAndCountAll({
      where,
      attributes: { exclude: ['password_hash'] },
      offset,
      limit: parsedLimit,
      order: [['created_at', 'DESC']]
    });

    res.json({ providers: rows, total: count, page: parseInt(page), pages: Math.ceil(count / parsedLimit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    delete updates.password_hash;
    
    await JobProvider.update(updates, { where: { id } });
    res.json({ message: 'Provider updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProvider = async (req, res) => {
  try {
    await JobProvider.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Provider deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const { offset, limit: parsedLimit } = paginate(page, limit);
    
    let where = {};
    if (status) where.status = status;

    const { rows, count } = await JobRequest.findAndCountAll({
      where,
      include: [
        { model: JobProvider, attributes: ['id', 'name', 'company_name'] },
        { model: Worker, attributes: ['id', 'name', 'category'] }
      ],
      offset,
      limit: parsedLimit,
      order: [['created_at', 'DESC']]
    });

    res.json({ jobs: rows, total: count, page: parseInt(page), pages: Math.ceil(count / parsedLimit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    await JobRequest.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Job updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    await JobRequest.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { offset, limit: parsedLimit } = paginate(page, limit);
    
    const { rows, count } = await Rating.findAndCountAll({
      offset,
      limit: parsedLimit,
      order: [['created_at', 'DESC']]
    });

    res.json({ reviews: rows, total: count, page: parseInt(page), pages: Math.ceil(count / parsedLimit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    await Rating.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnalytics,
  getProviderLocations,
  getWorkers,
  updateWorker,
  deleteWorker,
  getProviders,
  updateProvider,
  deleteProvider,
  getJobs,
  updateJob,
  deleteJob,
  getReviews,
  deleteReview
};
