const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('provider'));

router.get('/workers/search', providerController.searchWorkers);
router.get('/workers/:id', providerController.getWorkerProfile);

router.get('/profile', providerController.getProviderProfile);
router.patch('/profile', providerController.updateProviderProfile);
router.patch('/location', providerController.updateProviderLocation);

router.post('/jobs', providerController.postJob);
router.post('/jobs/multiple', providerController.sendJobToMultipleWorkers);
router.get('/jobs', providerController.getMyJobs);
router.patch('/jobs/:id/status', providerController.updateJobStatus);

router.post('/rate', providerController.rateWorker);

module.exports = router;
