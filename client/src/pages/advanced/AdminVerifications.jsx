import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminVerifications = () => {
  const [data, setData] = useState({ verifications: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/verifications/admin/pending?status=${statusFilter}`);
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id, status) => {
    const notes = prompt(`Enter optional notes for ${status}:`);
    if (notes === null) return; // cancelled

    try {
      await api.patch(`/verifications/admin/${id}/review`, { status, admin_notes: notes });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Review failed');
    }
  };

  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Verification Management</h2>
        <select 
          value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '8px 16px', borderRadius: '4px' }}
        >
          <option value="all">All Documents</option>
          <option value="pending">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : data.verifications.length > 0 ? (
        <table className="data-table" style={{ width: '100%', background: 'var(--bg-card)' }}>
          <thead>
            <tr>
              <th>Worker</th>
              <th>Document</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.verifications.map(v => (
              <tr key={v.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {v.Worker.photo_url ? (
                      <img src={`${import.meta.env.VITE_API_URL}${v.Worker.photo_url}`} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                    ) : (
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-secondary)' }} />
                    )}
                    <div>
                      <div>{v.Worker.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.Worker.category}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <a href={`${import.meta.env.VITE_API_URL}${v.file_url}`} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>
                    {v.doc_label}
                  </a>
                </td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                    background: v.status === 'approved' ? 'rgba(16,185,129,0.1)' : 
                                v.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                    color: v.status === 'approved' ? 'var(--accent-green)' : 
                           v.status === 'rejected' ? 'var(--accent-red)' : 'var(--accent-amber)'
                  }}>
                    {v.status.toUpperCase()}
                  </span>
                </td>
                <td>{new Date(v.created_at).toLocaleDateString()}</td>
                <td>
                  {v.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleReview(v.id, 'approved')} style={{ background: 'var(--accent-green)', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Approve</button>
                      <button onClick={() => handleReview(v.id, 'rejected')} style={{ background: 'var(--accent-red)', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="dashboard-card" style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ color: 'var(--text-muted)' }}>No verifications found for the selected status.</p>
        </div>
      )}
    </div>
  );
};

export default AdminVerifications;
