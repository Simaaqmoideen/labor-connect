const { WorkVerification, JobRequest, Worker } = require('../models');

// Upload "Before Work" image (by employer)
const uploadBeforeImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    const { jobId } = req.params;
    const job = await JobRequest.findOne({ where: { id: jobId, provider_id: req.user.id } });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const file_url = `/uploads/work-verify/${req.file.filename}`;

    let verification = await WorkVerification.findOne({ where: { job_request_id: jobId } });
    if (verification) {
      verification.before_image_url = file_url;
      await verification.save();
    } else {
      verification = await WorkVerification.create({
        job_request_id: jobId,
        before_image_url: file_url,
        completion_status: 'pending'
      });
    }

    res.json({ message: 'Before image uploaded', verification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload "After Work" image (by worker) + run AI comparison
const uploadAfterImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    const { jobId } = req.params;
    const job = await JobRequest.findOne({ where: { id: jobId, worker_id: req.user.id } });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const file_url = `/uploads/work-verify/${req.file.filename}`;

    let verification = await WorkVerification.findOne({ where: { job_request_id: jobId } });
    if (!verification) {
      return res.status(400).json({ message: 'Before image must be uploaded first' });
    }

    verification.after_image_url = file_url;

    // Simulated AI comparison — generates a realistic confidence score
    // In production, this would call an ML API (Google Vision, AWS Rekognition, etc.)
    const confidence = generateConfidenceScore();
    verification.confidence_score = confidence;

    if (confidence >= 75) {
      verification.completion_status = 'completed';
    } else if (confidence >= 40) {
      verification.completion_status = 'partial';
    } else {
      verification.completion_status = 'failed';
    }

    verification.verified_at = new Date();
    await verification.save();

    res.json({
      message: 'After image uploaded and verified',
      verification,
      result: {
        confidence_score: confidence,
        status: verification.completion_status,
        status_label: getStatusLabel(verification.completion_status),
        status_icon: getStatusIcon(verification.completion_status)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get verification status for a job
const getVerificationStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const verification = await WorkVerification.findOne({
      where: { job_request_id: jobId },
      include: [{
        model: JobRequest,
        attributes: ['id', 'title', 'status', 'worker_id', 'provider_id']
      }]
    });

    if (!verification) {
      return res.json({ exists: false, message: 'No verification started for this job' });
    }

    res.json({
      exists: true,
      verification,
      result: verification.confidence_score !== null ? {
        confidence_score: parseFloat(verification.confidence_score),
        status: verification.completion_status,
        status_label: getStatusLabel(verification.completion_status),
        status_icon: getStatusIcon(verification.completion_status)
      } : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Worker's verification history
const getVerificationHistory = async (req, res) => {
  try {
    const workerId = req.user.id;

    const jobs = await JobRequest.findAll({
      where: { worker_id: workerId },
      attributes: ['id']
    });

    const jobIds = jobs.map(j => j.id);

    const verifications = await WorkVerification.findAll({
      where: { job_request_id: jobIds },
      include: [{
        model: JobRequest,
        attributes: ['id', 'title', 'status', 'completed_at']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json({ verifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Simulated AI confidence score generator.
 * Uses a weighted random approach that favors realistic "completed" outcomes.
 * In production, replace with actual image analysis API call.
 */
function generateConfidenceScore() {
  // 60% chance of high confidence (70-98)
  // 25% chance of moderate confidence (40-69)
  // 15% chance of low confidence (10-39)
  const rand = Math.random();
  if (rand < 0.60) return Math.round(70 + Math.random() * 28);
  if (rand < 0.85) return Math.round(40 + Math.random() * 29);
  return Math.round(10 + Math.random() * 29);
}

function getStatusLabel(status) {
  switch (status) {
    case 'completed': return '✅ Work Completed';
    case 'partial': return '⚠ Partial Completion';
    case 'failed': return '❌ Verification Failed';
    default: return '⏳ Pending Verification';
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'completed': return '✅';
    case 'partial': return '⚠️';
    case 'failed': return '❌';
    default: return '⏳';
  }
}

module.exports = {
  uploadBeforeImage,
  uploadAfterImage,
  getVerificationStatus,
  getVerificationHistory
};
