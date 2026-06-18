const { Worker, WorkerVerification } = require('../models');
const path = require('path');

const DOC_TYPE_LABELS = {
  aadhaar: 'Aadhaar Card',
  government_id: 'Government ID',
  skill_certificate: 'Skill Certificate',
  trade_license: 'Trade License'
};

const BADGE_MAP = {
  skill_certificate: {
    Electrician: '✔ Certified Electrician',
    Plumber: '✔ Certified Plumber',
    Carpenter: '✔ Certified Carpenter',
    Painter: '✔ Certified Painter',
    Mason: '✔ Certified Mason',
    default: '✔ Certified Professional'
  }
};

// Worker uploads a verification document
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { doc_type, doc_label } = req.body;
    if (!DOC_TYPE_LABELS[doc_type]) {
      return res.status(400).json({ message: 'Invalid document type' });
    }

    const file_url = `/uploads/verifications/${req.file.filename}`;

    const verification = await WorkerVerification.create({
      worker_id: req.user.id,
      doc_type,
      doc_label: doc_label || DOC_TYPE_LABELS[doc_type],
      file_url,
      status: 'pending'
    });

    res.status(201).json({ message: 'Document uploaded for review', verification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Worker views their verifications
const getMyVerifications = async (req, res) => {
  try {
    const verifications = await WorkerVerification.findAll({
      where: { worker_id: req.user.id },
      order: [['created_at', 'DESC']]
    });

    const worker = await Worker.findByPk(req.user.id, {
      attributes: ['verification_badges', 'is_verified', 'category']
    });

    res.json({
      verifications,
      badges: worker.verification_badges || [],
      is_verified: worker.is_verified
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: get pending verifications
const getPendingVerifications = async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status !== 'all') where.status = status;

    const { rows, count } = await WorkerVerification.findAndCountAll({
      where,
      include: [{ model: Worker, attributes: ['id', 'name', 'category', 'phone', 'photo_url'] }],
      order: [['created_at', 'ASC']],
      offset,
      limit: parseInt(limit)
    });

    res.json({
      verifications: rows,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: approve or reject
const reviewVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }

    const verification = await WorkerVerification.findByPk(id, {
      include: [{ model: Worker }]
    });
    if (!verification) return res.status(404).json({ message: 'Verification not found' });

    verification.status = status;
    verification.admin_notes = admin_notes || '';
    verification.reviewed_by = req.user.id;
    verification.reviewed_at = new Date();
    await verification.save();

    // If approved, update worker badges
    if (status === 'approved') {
      const worker = verification.Worker;
      let badges = worker.verification_badges || [];

      // Add verified worker badge if aadhaar or gov id approved
      if (['aadhaar', 'government_id'].includes(verification.doc_type)) {
        if (!badges.includes('✔ Verified Worker')) {
          badges.push('✔ Verified Worker');
        }
        await Worker.update({ is_verified: true }, { where: { id: worker.id } });
      }

      // Add skill-specific badge
      if (verification.doc_type === 'skill_certificate') {
        const category = worker.category || 'default';
        const badge = BADGE_MAP.skill_certificate[category] || BADGE_MAP.skill_certificate.default;
        if (!badges.includes(badge)) {
          badges.push(badge);
        }
      }

      if (verification.doc_type === 'trade_license') {
        if (!badges.includes('✔ Licensed Professional')) {
          badges.push('✔ Licensed Professional');
        }
      }

      await Worker.update({ verification_badges: badges }, { where: { id: worker.id } });
    }

    res.json({ message: `Verification ${status}`, verification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadDocument,
  getMyVerifications,
  getPendingVerifications,
  reviewVerification,
  DOC_TYPE_LABELS
};
