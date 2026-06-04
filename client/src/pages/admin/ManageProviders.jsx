import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import StatusBadge from '../../components/StatusBadge';

const ManageProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getProviders({ search, status: filterStatus });
      setProviders(res.data.providers || []);
    } catch {
      toast.error('Failed to fetch providers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProviders(); }, [search, filterStatus]);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      await adminAPI.updateProviderStatus(id, newStatus);
      toast.success(`Provider ${newStatus}`);
      fetchProviders();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteProvider(id);
      toast.success('Provider deleted');
      setConfirmDelete(null);
      fetchProviders();
    } catch {
      toast.error('Failed to delete provider');
    }
  };

  const filtered = providers.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="page-title">Manage Providers</h1>
        <p className="page-subtitle">Oversee job provider accounts and activity</p>
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
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: '3rem' }}>🏢</span>
          <p>No providers found</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Company</th>
                <th>Jobs Posted</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(provider => (
                <tr key={provider.id}>
                  <td>
                    <div className="user-cell">
                      <div className="avatar">
                        <span>{provider.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="user-name">{provider.name}</div>
                        <div className="user-email">{provider.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{provider.company_name || '—'}</td>
                  <td>{provider.jobs_posted || 0}</td>
                  <td>₹{(provider.total_spent || 0).toLocaleString()}</td>
                  <td><StatusBadge status={provider.is_suspended ? 'suspended' : 'active'} /></td>
                  <td>{provider.createdAt ? new Date(provider.createdAt).toLocaleDateString() : '—'}</td>
                  <td>
                    <div className="action-btns">
                      <button
                        className={`btn btn-sm ${!provider.is_suspended ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleToggleStatus(provider.id, provider.is_suspended ? 'suspended' : 'active')}
                      >
                        {!provider.is_suspended ? 'Suspend' : 'Activate'}
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setConfirmDelete(provider)}
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
          title="Delete Provider"
          message={`Are you sure you want to delete "${confirmDelete.name}"? This action cannot be undone.`}
          onConfirm={() => handleDelete(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
};

export default ManageProviders;
