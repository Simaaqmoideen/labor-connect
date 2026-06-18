import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import ImageCompare from '../../components/advanced/ImageCompare';
import ConfidenceGauge from '../../components/advanced/ConfidenceGauge';
import { useAuth } from '../../context/AuthContext';

const WorkVerificationPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, [id]);

  const fetchStatus = async () => {
    try {
      const res = await api.get(`/work-verify/job/${id}/status`);
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Select an image');

    const formData = new FormData();
    formData.append('image', file);
    
    // Provider uploads before, worker uploads after
    const endpoint = user.role === 'provider' 
      ? `/work-verify/job/${id}/before` 
      : `/work-verify/job/${id}/after`;

    setUploading(true);
    try {
      await api.post(endpoint, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('Image uploaded successfully');
      setFile(null);
      fetchStatus();
    } catch (error) {
      alert(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="page-container"><p>Loading verification...</p></div>;

  const verif = data?.verification;
  const isProvider = user.role === 'provider';

  return (
    <div className="page-container" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>AI Work Verification (Job #{id})</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        Employer uploads "Before" photo. Worker uploads "After" photo. AI calculates completion confidence.
      </p>

      {/* Upload Section */}
      {(!verif || (isProvider && !verif.before_image_url) || (!isProvider && verif.before_image_url && !verif.after_image_url)) && (
        <div className="dashboard-card" style={{ marginBottom: '24px' }}>
          <h3>Upload {isProvider ? 'Before' : 'After'} Work Image</h3>
          <form onSubmit={handleUpload} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
            <button type="submit" className="btn-primary" disabled={!file || uploading}>
              {uploading ? 'Processing...' : 'Upload & Verify'}
            </button>
          </form>
        </div>
      )}

      {/* Results Section */}
      {verif && (
        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {/* Images */}
          <div className="dashboard-card" style={{ gridColumn: '1 / -1' }}>
            <h3>Visual Comparison</h3>
            {verif.before_image_url && verif.after_image_url ? (
              <ImageCompare 
                beforeImage={`${import.meta.env.VITE_API_URL}${verif.before_image_url}`}
                afterImage={`${import.meta.env.VITE_API_URL}${verif.after_image_url}`}
              />
            ) : (
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, border: '1px dashed var(--border-color)', padding: '16px', textAlign: 'center', borderRadius: '8px' }}>
                  <h4>Before</h4>
                  {verif.before_image_url ? 
                    <img src={`${import.meta.env.VITE_API_URL}${verif.before_image_url}`} style={{ width: '100%', borderRadius: '4px' }} alt="" /> : 
                    <span style={{ color: 'var(--text-muted)' }}>Waiting for Employer...</span>
                  }
                </div>
                <div style={{ flex: 1, border: '1px dashed var(--border-color)', padding: '16px', textAlign: 'center', borderRadius: '8px' }}>
                  <h4>After</h4>
                  {verif.after_image_url ? 
                    <img src={`${import.meta.env.VITE_API_URL}${verif.after_image_url}`} style={{ width: '100%', borderRadius: '4px' }} alt="" /> : 
                    <span style={{ color: 'var(--text-muted)' }}>Waiting for Worker...</span>
                  }
                </div>
              </div>
            )}
          </div>

          {/* AI Result */}
          {data.result && (
            <div className="dashboard-card" style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
              <ConfidenceGauge score={data.result.confidence_score} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{data.result.status_icon}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{data.result.status_label}</div>
                <p style={{ color: 'var(--text-muted)', margin: '8px 0 0 0', maxWidth: '300px' }}>
                  AI analysis compares structural changes, cleanliness, and material presence between the before and after images.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkVerificationPage;
