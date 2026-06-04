import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import StarRating from '../../components/StarRating';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getReviews({ search, rating: filterRating });
      setReviews(res.data.reviews || []);
    } catch {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [search, filterRating]);

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteReview(id);
      toast.success('Review deleted');
      setConfirmDelete(null);
      fetchReviews();
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const filtered = reviews.filter(r =>
    r.workerName?.toLowerCase().includes(search.toLowerCase()) ||
    r.providerName?.toLowerCase().includes(search.toLowerCase()) ||
    r.comment?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="page-title">Manage Reviews</h1>
        <p className="page-subtitle">Moderate worker reviews and ratings</p>
      </div>

      <div className="filter-bar">
        <input
          className="search-input"
          placeholder="Search by worker, provider, or comment..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterRating}
          onChange={e => setFilterRating(e.target.value)}
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: '3rem' }}>⭐</span>
          <p>No reviews found</p>
        </div>
      ) : (
        <div className="reviews-grid">
          {filtered.map(review => (
            <div key={review.id} className="review-card card">
              <div className="review-header">
                <div>
                  <div className="user-name">Worker: {review.workerName}</div>
                  <div className="user-email">By: {review.providerName}</div>
                </div>
                <StarRating value={review.rating} readOnly size="sm" />
              </div>
              {review.comment && (
                <p className="review-comment">"{review.comment}"</p>
              )}
              <div className="review-footer">
                <span className="text-muted">
                  {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : '—'}
                </span>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => setConfirmDelete(review)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete Review"
          message="Are you sure you want to remove this review? This action cannot be undone."
          onConfirm={() => handleDelete(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
};

export default ManageReviews;
