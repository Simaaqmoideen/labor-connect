import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import VerificationBadge from '../../components/advanced/VerificationBadge';

const WorkerVerifications = () => {
  const [data, setData] = useState({ verifications: [], badges: [], is_verified: false });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState('aadhaar');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/verifications/my');
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    const formData = new FormData();
    formData.append('document', file);
    formData.append('doc_type', docType);

    setUploading(true);
    try {
      await api.post('/verifications/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Document uploaded successfully');
      setFile(null);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="page-container"><p>Loading verifications...</p></div>;

  return (
    <div className="page-container" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>My Verifications & Badges</h2>

      {data.badges.length > 0 && (
        <div className="dashboard-card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginTop: 0 }}>Active Badges</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {data.badges.map((b, i) => <VerificationBadge key={i} label={b} />)}
          </div>
        </div>
      )}

      <div className="dashboard-card" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginTop: 0 }}>Upload Document</h3>
        <form onSubmit={handleUpload} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Document Type</label>
            <select 
              value={docType} onChange={e => setDocType(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
            >
              <option value="aadhaar">Aadhaar Card</option>
              <option value="government_id">Government ID</option>
              <option value="skill_certificate">Skill Certificate</option>
              <option value="trade_license">Trade License</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>File</label>
            <input 
              type="file" accept="image/*,.pdf"
              onChange={e => setFile(e.target.files[0])}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={!file || uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>

      <div className="dashboard-card">
        <h3 style={{ marginTop: 0 }}>Document History</h3>
        {data.verifications.length > 0 ? (
          <table className="data-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Document</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {data.verifications.map(v => (
                <tr key={v.id}>
                  <td>
                    <a href={`${import.meta.env.VITE_API_URL}${v.file_url}`} target="_blank" rel="noreferrer">
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
                  <td>{v.admin_notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No documents uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default WorkerVerifications;
