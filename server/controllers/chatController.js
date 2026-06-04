const { ChatMessage, JobRequest, JobProvider, Worker } = require('../models');

const getChatHistory = async (req, res) => {
  try {
    const { jobRequestId } = req.params;
    
    // Verify user has access to this job
    const job = await JobRequest.findByPk(jobRequestId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    
    if (req.user.role === 'provider' && job.provider_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'worker' && job.worker_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await ChatMessage.findAll({
      where: { job_request_id: jobRequestId },
      order: [['sent_at', 'ASC']]
    });

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { jobRequestId } = req.params;
    const { message } = req.body;

    const job = await JobRequest.findByPk(jobRequestId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const chatMessage = await ChatMessage.create({
      job_request_id: jobRequestId,
      sender_id: req.user.id,
      sender_role: req.user.role,
      message
    });

    // Determine recipient for socket emission
    let targetRoom = '';
    if (req.user.role === 'provider') {
      targetRoom = `user_worker_${job.worker_id}`;
    } else if (req.user.role === 'worker') {
      targetRoom = `user_provider_${job.provider_id}`;
    }

    const io = req.app.get('io');
    if (io && targetRoom) {
      io.to(`job_${jobRequestId}`).emit('chat:message', chatMessage); // Alternatively emit to job room
    }

    res.status(201).json({ message: chatMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getChatHistory,
  sendMessage
};
