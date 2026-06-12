const express = require('express');
const router = express.Router();
const aiChatController = require('../controllers/aiChatController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/message', aiChatController.processMessage);
router.get('/history', aiChatController.getChatHistory);

module.exports = router;
