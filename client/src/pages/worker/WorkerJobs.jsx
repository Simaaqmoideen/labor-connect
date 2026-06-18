import React, { useState, useEffect } from 'react';
import { workerAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import ChatWindow from '../../components/ChatWindow';

const WorkerJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);

  const fetchJobs = async () => {
    try {
      const { data } = await workerAPI.getMyJobs();
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

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="container" style={{ padding: '20px 0' }}>
      <h1 style={{ marginBottom: '20px' }}>My Jobs</h1>

      {jobs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          You have no job history yet.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {jobs.map(req => (
            <div key={req.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px' }}>{req.title}</h3>
                  <p style={{ margin: '0 0 10px', color: 'var(--text-secondary)' }}>{req.description}</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <span>Provider: <strong style={{ color: 'var(--text-primary)' }}>{req.JobProvider?.name || 'Unknown'}</strong></span>
                    <span>Company: <strong style={{ color: 'var(--text-primary)' }}>{req.JobProvider?.company_name || 'N/A'}</strong></span>
                    <span>Wage: <strong style={{ color: 'var(--text-primary)' }}>₹{req.expected_wage || 'N/A'}/day</strong></span>
                    <span>Date: <strong style={{ color: 'var(--text-primary)' }}>{req.scheduled_at ? new Date(req.scheduled_at).toLocaleDateString() : 'N/A'}</strong></span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                  <StatusBadge status={req.status} />
                  {req.status === 'accepted' && (
                    <button className="btn btn-secondary" onClick={() => setActiveChat(req.id)}>Chat with Provider</button>
                  )}
                </div>
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
          <ChatWindow jobRequestId={activeChat} currentUser={{ role: 'worker', id: JSON.parse(atob(localStorage.getItem('labor_connect_token').split('.')[1])).id }} />
        </div>
      )}
    </div>
  );
};

export default WorkerJobs;
