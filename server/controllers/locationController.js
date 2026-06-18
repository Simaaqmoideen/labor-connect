const { Location, JobRequest, JobProvider, Worker } = require('../models');

const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    
    await Location.upsert({
      user_id: req.user.id,
      user_role: req.user.role,
      lat,
      lng,
      updated_at: new Date()
    });

    if (req.user.role === 'provider') {
      await JobProvider.update({ lat, lng }, { where: { id: req.user.id } });
    } else if (req.user.role === 'worker') {
      await Worker.update({ lat, lng }, { where: { id: req.user.id } });
    }

    res.json({ message: 'Location updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLocation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.query; // e.g., ?role=worker
    
    if (!role) return res.status(400).json({ message: 'Role query param required' });

    const location = await Location.findOne({
      where: { user_id: userId, user_role: role }
    });

    if (!location) return res.status(404).json({ message: 'Location not found' });
    res.json({ location });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateWorkSiteLocation = async (req, res) => {
  try {
    const { jobRequestId } = req.params;
    const { lat, lng, address } = req.body;

    const job = await JobRequest.findOne({ where: { id: jobRequestId, provider_id: req.user.id } });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    job.work_location_lat = lat;
    job.work_location_lng = lng;
    job.work_location_address = address;
    await job.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`user_worker_${job.worker_id}`).emit('location:worksite_update', {
        jobId: job.id, lat, lng, address
      });
    }

    res.json({ message: 'Work site location updated', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateLocation,
  getLocation,
  updateWorkSiteLocation
};
