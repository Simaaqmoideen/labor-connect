const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register', authController.registerWithPassword);
router.post('/login', authController.loginWithPassword);
router.post('/otp/send', authController.sendOTPHandler);
router.post('/otp/verify-register', authController.verifyOTPAndRegister);
router.post('/otp/verify-login', authController.verifyOTPAndLogin);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
