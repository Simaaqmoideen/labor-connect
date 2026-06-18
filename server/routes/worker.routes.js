const express = require('express');
const router = express.Router();
const workerController = require('../controllers/workerController');
const { authenticate, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.use(authenticate, authorize('worker'));

router.get('/profile', workerController.getWorkerProfile);
router.patch('/profile', workerController.updateProfile);
router.patch('/availability', workerController.updateAvailability);
router.patch('/location', workerController.updateLocation);
router.get('/providers', workerController.getJobProviders);

router.get('/jobs/incoming', workerController.getIncomingRequests);
router.patch('/jobs/:id/respond', workerController.respondToJob);
router.get('/jobs', workerController.getMyJobs);

router.get('/earnings', workerController.getEarnings);
router.get('/ratings', workerController.getMyRatings);

router.post('/upload-photo', upload.single('photo'), workerController.uploadPhoto);

module.exports = router;
