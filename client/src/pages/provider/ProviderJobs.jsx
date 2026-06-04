import React, { useState, useEffect } from 'react';
import { providerAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import ChatWindow from '../../components/ChatWindow';

const ProviderJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);

  const fetchJobs = async () => {
    try {
      const { data } = await providerAPI.getMyJobs();
      setJobs(Array.isArray(data) ? data : (data.jobs || []));
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await providerAPI.updateJobStatus(id, status);
      toast.success(`Job marked as ${status}`);
      fetchJobs(); // refresh
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="container" style={{ padding: '20px 0' }}>
      <h1 style={{ marginBottom: '20px' }}>My Posted Jobs</h1>

      {jobs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          You haven't posted any jobs yet. Go to Find Workers to send job requests.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {jobs.map(job => (
            <div key={job.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px' }}>{job.title}</h3>
                  <p style={{ margin: '0 0 10px', color: 'var(--text-secondary)' }}>{job.description}</p>
                   <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      <span>Wage: ₹{job.expected_wage || 'N/A'}/day</span>
                      <span>Date: {job.scheduled_at ? new Date(job.scheduled_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                </div>
              </div>

              <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem' }}>Worker</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[job].map(req => (
                  <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {req.Worker?.name?.charAt(0)}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 500 }}>{req.Worker?.name}</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Phone: {req.Worker?.phone}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <StatusBadge status={req.status} />
                      
                      {req.status === 'accepted' && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button className="btn btn-secondary" onClick={() => setActiveChat(req.id)}>Chat</button>
                          <button className="btn btn-success" onClick={() => updateStatus(job.id, 'completed')}>Mark Completed</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeChat && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '350px', zIndex: 1000, boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ background: 'var(--accent-blue)', color: 'white', padding: '10px', display: 'flex', justifyContent: 'space-between', borderTopLeftRadius: 'var(--radius-md)', borderTopRightRadius: 'var(--radius-md)' }}>
            <h4 style={{ margin: 0 }}>Chat</h4>
            <button onClick={() => setActiveChat(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
          </div>
          <ChatWindow jobRequestId={activeChat} currentUser={{ role: 'provider', id: JSON.parse(atob(localStorage.getItem('labor_connect_token').split('.')[1])).id }} />
        </div>
      )}
    </div>
  );
};

export default ProviderJobs;
