const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');
const { authenticate, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/verifications/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.user.id + '-doc-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Worker routes
router.post('/upload', authenticate, authorize('worker'), upload.single('document'), verificationController.uploadDocument);
router.get('/my', authenticate, authorize('worker'), verificationController.getMyVerifications);

// Admin routes
router.get('/admin/pending', authenticate, authorize('admin'), verificationController.getPendingVerifications);
router.patch('/admin/:id/review', authenticate, authorize('admin'), verificationController.reviewVerification);

module.exports = router;
