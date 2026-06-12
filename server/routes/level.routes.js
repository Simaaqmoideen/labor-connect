const express = require('express');
const router = express.Router();
const levelController = require('../controllers/levelController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('worker'));

router.get('/', levelController.getWorkerLevel);
router.get('/progress', levelController.getLevelProgress);

module.exports = router;
