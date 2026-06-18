import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import StatusBadge from '../../components/StatusBadge';

const STATUS_OPTIONS = ['all', 'open', 'assigned', 'in_progress', 'completed', 'cancelled'];

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getJobs({ search, status: filterStatus });
      setJobs(res.data.jobs || []);
    } catch {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, [search, filterStatus]);

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteJob(id);
      toast.success('Job deleted');
      setConfirmDelete(null);
      fetchJobs();
    } catch {
      toast.error('Failed to delete job');
    }
  };

  const filtered = jobs.filter(j =>
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.JobProvider?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="page-title">Manage Jobs</h1>
        <p className="page-subtitle">Monitor all posted jobs across the platform</p>
      </div>

      <div className="filter-bar">
        <input
          className="search-input"
          placeholder="Search by title or provider..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{s === 'all' ? 'All Status' : s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: '3rem' }}>💼</span>
          <p>No jobs found</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Provider</th>
                <th>Worker</th>
                <th>Pay</th>
                <th>Status</th>
                <th>Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(job => (
                <tr key={job.id}>
                  <td>
                    <div className="user-name">{job.title}</div>
                    <div className="user-email">{job.work_location_address || 'No location'}</div>
                  </td>
                  <td>{job.JobProvider?.name || '—'}</td>
                  <td>{job.Worker?.name || <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>}</td>
                  <td>₹{job.expected_wage || 0}/day</td>
                  <td><StatusBadge status={job.status} /></td>
                  <td>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '—'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setConfirmDelete(job)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete Job"
          message={`Delete job "${confirmDelete.title}"? This action cannot be undone.`}
          onConfirm={() => handleDelete(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
};

export default ManageJobs;
