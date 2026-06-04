import React, { useState, useEffect, useContext } from 'react';
import { workerAPI } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import MapView from '../../components/MapView';
import useGeolocation from '../../hooks/useGeolocation';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const WorkerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [earnings, setEarnings] = useState({ total_earnings: 0, pending_jobs: 0 });
  const [incomingJobs, setIncomingJobs] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { lat, lng } = useGeolocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, earnRes, jobsRes, provRes] = await Promise.all([
          workerAPI.getProfile(),
          workerAPI.getEarnings(),
          workerAPI.getIncomingRequests(),
          workerAPI.getJobProviders()
        ]);
        setProfile(profRes.data.worker || profRes.data);
        setEarnings(earnRes.data || { total_earnings: 0, pending_jobs: 0 });
        setIncomingJobs(Array.isArray(jobsRes.data) ? jobsRes.data : (jobsRes.data.jobs || []));
        setProviders(provRes.data.providers || []);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (lat && lng && profile) {
      workerAPI.updateLocation({ lat, lng }).catch(() => {});
    }
  }, [lat, lng, profile]);

  const toggleAvailability = async () => {
    try {
      const newAvail = profile.availability === 'available' ? 'offline' : 'available';
      await workerAPI.updateAvailability(newAvail);
      setProfile({ ...profile, availability: newAvail });
      toast.success(`You are now ${newAvail}`);
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const respondToJob = async (id, status) => {
    try {
      await workerAPI.respondToJob(id, status);
      setIncomingJobs(prev => prev.filter(j => j.id !== id));
      toast.success(`Job ${status}`);
    } catch (error) {
      toast.error('Failed to respond');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="container" style={{ padding: '20px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '20px' }}>
        
        {/* Sidebar */}
        <div>
          <div className="card" style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--accent-blue)', color: 'white', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
              {user?.name?.charAt(0)}
            </div>
            <h3>{user?.name}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>{profile?.category}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
              <span>Status</span>
              <StatusBadge status={profile?.availability} />
            </div>
            
            <button 
              className={`btn ${profile?.availability === 'available' ? 'btn-secondary' : 'btn-primary'}`} 
              style={{ width: '100%', marginTop: '15px' }}
              onClick={toggleAvailability}
            >
              {profile?.availability === 'available' ? 'Go Offline' : 'Go Online'}
            </button>
          </div>

          <div className="card">
            <h4 style={{ marginBottom: '15px' }}>Quick Stats</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Earnings</span>
              <span style={{ fontWeight: 'bold' }}>₹{earnings.total_earnings || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Pending Jobs</span>
              <span style={{ fontWeight: 'bold' }}>{earnings.pending_jobs || 0}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div>
          <h2 style={{ marginBottom: '20px' }}>Incoming Job Requests</h2>
          {incomingJobs.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No new job requests at the moment.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {incomingJobs.map(job => (
                <div key={job.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px' }}>{job.title}</h4>
                    <p style={{ margin: '0 0 5px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {job.description}
                    </p>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span>Provider: {job.JobProvider?.name || 'Unknown'}</span>
                      <span>Offered: ₹{job.expected_wage || 'N/A'}</span>
                      {job.scheduled_at && <span>Required: {new Date(job.scheduled_at).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => respondToJob(job.id, 'rejected')} className="btn btn-danger">Decline</button>
                    <button onClick={() => respondToJob(job.id, 'accepted')} className="btn btn-success">Accept</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {lat && lng && (
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ marginBottom: '15px' }}>Job Providers Near You</h3>
              <MapView 
                center={[lat, lng]} 
                showUserLocation 
                markers={providers.map(p => ({
                  lat: p.lat,
                  lng: p.lng,
                  type: 'provider',
                  popup: p.company_name ? `${p.name} (${p.company_name})` : p.name
                }))}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default WorkerDashboard;
