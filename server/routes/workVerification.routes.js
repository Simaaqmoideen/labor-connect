const express = require('express');
const router = express.Router();
const workVerificationController = require('../controllers/workVerificationController');
const { authenticate, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/work-verify/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.params.jobId + '-verify-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.use(authenticate);

// Employer uploads before image
router.post('/job/:jobId/before', authorize('provider'), upload.single('image'), workVerificationController.uploadBeforeImage);

// Worker uploads after image
router.post('/job/:jobId/after', authorize('worker'), upload.single('image'), workVerificationController.uploadAfterImage);

// Both can view status
router.get('/job/:jobId/status', workVerificationController.getVerificationStatus);

// Worker history
router.get('/history', authorize('worker'), workVerificationController.getVerificationHistory);

module.exports = router;
