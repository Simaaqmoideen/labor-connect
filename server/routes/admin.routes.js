const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('admin'));

router.get('/analytics', adminController.getAnalytics);

router.get('/workers', adminController.getWorkers);
router.patch('/workers/:id', adminController.updateWorker);
router.delete('/workers/:id', adminController.deleteWorker);

router.get('/providers/locations', adminController.getProviderLocations);
router.get('/providers', adminController.getProviders);
router.patch('/providers/:id', adminController.updateProvider);
router.delete('/providers/:id', adminController.deleteProvider);

router.get('/jobs', adminController.getJobs);
router.patch('/jobs/:id', adminController.updateJob);
router.delete('/jobs/:id', adminController.deleteJob);

router.get('/reviews', adminController.getReviews);
router.delete('/reviews/:id', adminController.deleteReview);

module.exports = router;
