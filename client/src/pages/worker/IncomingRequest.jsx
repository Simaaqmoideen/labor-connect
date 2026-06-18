import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workerAPI } from '../../services/api';
import { SocketContext } from '../../context/SocketContext';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import MapView from '../../components/MapView';
import LoadingSpinner from '../../components/LoadingSpinner';

const IncomingRequest = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 min countdown

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await workerAPI.getJobRequest(jobId);
        setJob(res.data.job);
      } catch {
        toast.error('Failed to load job request');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      toast('Request expired');
      navigate('/worker/dashboard');
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAccept = async () => {
    try {
      setResponding(true);
      await workerAPI.acceptJob(jobId);
      socket?.emit('jobAccepted', { jobId, workerId: user?.id });
      toast.success('Job accepted! 🎉');
      navigate('/worker/jobs');
    } catch {
      toast.error('Failed to accept job');
      setResponding(false);
    }
  };

  const handleReject = async () => {
    try {
      setResponding(true);
      await workerAPI.rejectJob(jobId);
      socket?.emit('jobRejected', { jobId, workerId: user?.id });
      toast('Job declined');
      navigate('/worker/dashboard');
    } catch {
      toast.error('Failed to reject job');
      setResponding(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const timerPercent = (timeLeft / 120) * 100;
  const timerColor = timeLeft > 60 ? 'var(--accent)' : timeLeft > 30 ? '#f59e0b' : '#ef4444';

  if (loading) return <LoadingSpinner />;

  if (!job) {
    return (
      <div className="page-centered">
        <div className="empty-state">
          <span style={{ fontSize: '3rem' }}>❌</span>
          <p>Job request not found or expired.</p>
          <button className="btn btn-primary" onClick={() => navigate('/worker/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const markers = job.lat && job.lng ? [{ lat: job.lat, lng: job.lng, label: 'Job Site', type: 'job' }] : [];

  return (
    <div className="incoming-request-page">
      {/* Timer Header */}
      <div className="timer-banner" style={{ borderColor: timerColor }}>
        <div className="timer-text" style={{ color: timerColor }}>
          ⏱ Respond within: <strong>{formatTime(timeLeft)}</strong>
        </div>
        <div className="timer-bar-wrapper">
          <div
            className="timer-bar"
            style={{ width: `${timerPercent}%`, background: timerColor, transition: 'width 1s linear, background 0.5s' }}
          />
        </div>
      </div>

      <div className="request-content">
        {/* Job Details Card */}
        <div className="job-detail-card card">
          <div className="job-detail-header">
            <span className="job-badge">🆕 New Job Request</span>
            <h2 className="job-title">{job.title}</h2>
          </div>

          <div className="job-meta-grid">
            <div className="meta-item">
              <span className="meta-icon">💰</span>
              <div>
                <div className="meta-label">Daily Wage</div>
                <div className="meta-value">₹{job.dailyWage}/day</div>
              </div>
            </div>
            <div className="meta-item">
              <span className="meta-icon">📅</span>
              <div>
                <div className="meta-label">Duration</div>
                <div className="meta-value">{job.duration || 1} day(s)</div>
              </div>
            </div>
            <div className="meta-item">
              <span className="meta-icon">📍</span>
              <div>
                <div className="meta-label">Location</div>
                <div className="meta-value">{job.location || 'See map'}</div>
              </div>
            </div>
            <div className="meta-item">
              <span className="meta-icon">🕐</span>
              <div>
                <div className="meta-label">Start Time</div>
                <div className="meta-value">{job.startTime || '8:00 AM'}</div>
              </div>
            </div>
          </div>

          {job.description && (
            <div className="job-description">
              <h4>Description</h4>
              <p>{job.description}</p>
            </div>
          )}

          {job.skills && job.skills.length > 0 && (
            <div className="job-skills">
              <h4>Required Skills</h4>
              <div className="skills-chips">
                {job.skills.map(s => <span key={s} className="skill-chip">{s}</span>)}
              </div>
            </div>
          )}

          {/* Provider Info */}
          <div className="provider-info">
            <div className="avatar">
              <span>{job.providerName?.[0]?.toUpperCase() || 'P'}</span>
            </div>
            <div>
              <div className="user-name">{job.providerName || 'Provider'}</div>
              <div className="user-email">⭐ {job.providerRating?.toFixed(1) || 'New'} rating</div>
            </div>
          </div>
        </div>

        {/* Map */}
        {markers.length > 0 && (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ height: '280px' }}>
              <MapView center={[job.lat, job.lng]} markers={markers} zoom={14} />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="request-actions">
          <button
            className="btn btn-danger btn-lg"
            onClick={handleReject}
            disabled={responding}
          >
            ✗ Decline
          </button>
          <button
            className="btn btn-success btn-lg"
            onClick={handleAccept}
            disabled={responding}
          >
            ✓ Accept Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingRequest;
