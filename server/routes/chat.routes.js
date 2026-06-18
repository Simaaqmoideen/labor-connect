const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/history/:jobRequestId', chatController.getChatHistory);
router.post('/send/:jobRequestId', chatController.sendMessage);

module.exports = router;
