import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { providerAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import StarRating from '../../components/StarRating';

const RateWorker = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { jobId, workerId, workerName } = location.state || {};

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [punctuality, setPunctuality] = useState(0);
  const [quality, setQuality] = useState(0);
  const [behavior, setBehavior] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select an overall rating');
      return;
    }
    try {
      setSubmitting(true);
      await providerAPI.rateWorker(jobId, {
        workerId,
        rating,
        comment,
        punctuality,
        quality,
        behavior,
      });
      toast.success('Review submitted successfully!');
      setSubmitted(true);
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (!jobId || !workerId) {
    return (
      <div className="page-centered">
        <div className="empty-state">
          <span style={{ fontSize: '3rem' }}>⚠️</span>
          <p>No job selected for rating.</p>
          <button className="btn btn-primary" onClick={() => navigate('/provider/jobs')}>
            Go to My Jobs
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="page-centered">
        <div className="success-card card">
          <div className="success-icon">🎉</div>
          <h2>Review Submitted!</h2>
          <p>Thank you for rating <strong>{workerName}</strong>. Your feedback helps the community.</p>
          <div className="action-btns" style={{ justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/provider/jobs')}>
              My Jobs
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/provider/dashboard')}>
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rate-worker-page">
      <div className="page-header">
        <h1 className="page-title">Rate Worker</h1>
        <p className="page-subtitle">Share your experience with {workerName || 'this worker'}</p>
      </div>

      <div className="rate-form-wrapper">
        <form onSubmit={handleSubmit} className="rate-form card">
          <div className="worker-banner">
            <div className="avatar avatar-lg">
              <span>{workerName?.[0]?.toUpperCase() || 'W'}</span>
            </div>
            <div>
              <h3>{workerName}</h3>
              <p className="text-muted">Job #{jobId}</p>
            </div>
          </div>

          <div className="rating-sections">
            <div className="rating-row">
              <label className="rating-label">⭐ Overall Rating <span className="required">*</span></label>
              <StarRating value={rating} onChange={setRating} size="lg" />
            </div>
            <div className="rating-row">
              <label className="rating-label">⏰ Punctuality</label>
              <StarRating value={punctuality} onChange={setPunctuality} />
            </div>
            <div className="rating-row">
              <label className="rating-label">🛠️ Work Quality</label>
              <StarRating value={quality} onChange={setQuality} />
            </div>
            <div className="rating-row">
              <label className="rating-label">🤝 Behavior</label>
              <StarRating value={behavior} onChange={setBehavior} />
            </div>
          </div>

          <div className="form-group">
            <label>Comment (optional)</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Share details about the worker's performance..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              maxLength={500}
            />
            <div className="char-count">{comment.length}/500</div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting || rating === 0}>
              {submitting ? 'Submitting...' : '📤 Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RateWorker;
