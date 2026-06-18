const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.put('/update', locationController.updateLocation);
router.get('/:userId', locationController.getLocation);
router.put('/worksite/:jobRequestId', authorize('provider'), locationController.updateWorkSiteLocation);

module.exports = router;
