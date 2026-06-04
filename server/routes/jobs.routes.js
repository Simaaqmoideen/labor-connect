const express = require('express');
const router = express.Router();
const { JobRequest, JobProvider, Worker } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

// Get single job details (accessible by admin, or the involved provider/worker)
router.get('/:id', async (req, res) => {
  try {
    const job = await JobRequest.findByPk(req.params.id, {
      include: [
        { model: JobProvider, attributes: ['name', 'company_name', 'phone', 'profile_photo'] },
        { model: Worker, attributes: ['name', 'category', 'phone', 'photo_url', 'rating_avg'] }
      ]
    });

    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (req.user.role === 'provider' && job.provider_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'worker' && job.worker_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin-only route to get all jobs is in admin.routes.js

module.exports = router;
