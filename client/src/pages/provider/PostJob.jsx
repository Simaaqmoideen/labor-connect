import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { providerAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { AuthContext } from '../../context/AuthContext';
import useGeolocation from '../../hooks/useGeolocation';

const PostJob = () => {
  const [searchParams] = useSearchParams();
  const workerId = searchParams.get('workerId');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { lat, lng } = useGeolocation();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    wage_offered: '',
    required_date: '',
    duration_days: '1'
  });

  useEffect(() => {
    if (!workerId) {
      toast.error('Please select a worker first');
      navigate('/provider/dashboard');
    }
  }, [workerId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!workerId) {
        toast.error('Worker ID is missing');
        setLoading(false);
        return;
      }

      const payload = {
        worker_id: parseInt(workerId),
        title: formData.title,
        description: formData.description,
        expected_wage: parseFloat(formData.wage_offered),
        scheduled_at: formData.required_date,
        work_location_lat: lat || user?.lat || null,
        work_location_lng: lng || user?.lng || null,
        work_location_address: user?.address || 'Provider Location'
      };

      await providerAPI.postJob(payload);
      toast.success('Job request sent to worker');
      navigate('/provider/jobs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '20px 0', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '20px' }}>{workerId ? 'Send Job Request' : 'Post a New Job'}</h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Job Title</label>
            <input type="text" required className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Need a plumber for pipe fixing" />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea required className="form-textarea" rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Detailed description of the work..."></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">Wage Offered (₹/day)</label>
              <input type="number" required className="form-input" value={formData.wage_offered} onChange={e => setFormData({...formData, wage_offered: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Required Date</label>
              <input type="date" required className="form-input" value={formData.required_date} onChange={e => setFormData({...formData, required_date: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Duration (Days)</label>
              <input type="number" required min="1" className="form-input" value={formData.duration_days} onChange={e => setFormData({...formData, duration_days: e.target.value})} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <LoadingSpinner /> : (workerId ? 'Send Request' : 'Post Job')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
