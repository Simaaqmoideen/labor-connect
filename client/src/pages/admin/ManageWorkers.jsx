import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import StatusBadge from '../../components/StatusBadge';

const ManageWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [page, setPage] = useState(1);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getWorkers({ search, status: filterStatus, page });
      setWorkers(res.data.workers || []);
    } catch {
      toast.error('Failed to fetch workers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkers(); }, [search, filterStatus, page]);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      await adminAPI.updateWorkerStatus(id, newStatus);
      toast.success(`Worker ${newStatus}`);
      fetchWorkers();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteWorker(id);
      toast.success('Worker deleted');
      setConfirmDelete(null);
      fetchWorkers();
    } catch {
      toast.error('Failed to delete worker');
    }
  };

  const filtered = workers.filter(w =>
    w.name?.toLowerCase().includes(search.toLowerCase()) ||
    w.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="page-title">Manage Workers</h1>
        <p className="page-subtitle">View, suspend, or remove worker accounts</p>
      </div>

      <div className="filter-bar">
        <input
          className="search-input"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: '3rem' }}>👷</span>
          <p>No workers found</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Worker</th>
                <th>Skills</th>
                <th>Rating</th>
                <th>Jobs Done</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(worker => (
                <tr key={worker.id}>
                  <td>
                    <div className="user-cell">
                      <div className="avatar">
                        {worker.photo
                          ? <img src={worker.photo} alt={worker.name} />
                          : <span>{worker.name?.[0]?.toUpperCase()}</span>
                        }
                      </div>
                      <div>
                        <div className="user-name">{worker.name}</div>
                        <div className="user-email">{worker.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="skills-chips">
                      {(worker.skills || []).slice(0, 2).map(s => (
                        <span key={s} className="skill-chip">{s}</span>
                      ))}
                      {(worker.skills || []).length > 2 && (
                        <span className="skill-chip">+{worker.skills.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="rating-cell">⭐ {parseFloat(worker.rating_avg || 0).toFixed(1)}</span>
                  </td>
                  <td>{worker.jobs_completed || 0}</td>
                  <td><StatusBadge status={worker.is_suspended ? 'suspended' : 'active'} /></td>
                  <td>{worker.createdAt ? new Date(worker.createdAt).toLocaleDateString() : '—'}</td>
                  <td>
                    <div className="action-btns">
                      <button
                        className={`btn btn-sm ${!worker.is_suspended ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleToggleStatus(worker.id, worker.is_suspended ? 'suspended' : 'active')}
                      >
                        {!worker.is_suspended ? 'Suspend' : 'Activate'}
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setConfirmDelete(worker)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete Worker"
          message={`Are you sure you want to delete "${confirmDelete.name}"? This action cannot be undone.`}
          onConfirm={() => handleDelete(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
};

export default ManageWorkers;
