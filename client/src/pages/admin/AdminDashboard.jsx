import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import LoadingSpinner from '../../components/LoadingSpinner';
import MapView from '../../components/MapView';
import { useTranslation } from 'react-i18next';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const StatCard = ({ label, value, icon, color }) => (
  <div className="card" style={{
    display: 'flex', alignItems: 'center', gap: '18px',
    padding: '20px 24px'
  }}>
    <div style={{
      width: 52, height: 52, borderRadius: '14px',
      background: color, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0
    }}>
      {icon}
    </div>
    <div>
      <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 }}>{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [analyticsRes, locRes] = await Promise.all([
          adminAPI.getAnalytics(),
          adminAPI.getProviderLocations()
        ]);
        setAnalytics(analyticsRes.data);
        setProviders(locRes.data.providers || []);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!analytics) return <div>Failed to load data</div>;

  const { total_workers, active_workers, total_providers, total_jobs, jobs_by_status, avg_rating, pending_verifications } = analytics;

  const pieData = {
    labels: [t('job_completed'), t('job_pending'), t('job_accepted'), t('job_rejected')],
    datasets: [{
      data: [
        jobs_by_status?.completed || 0,
        jobs_by_status?.pending || 0,
        jobs_by_status?.accepted || 0,
        jobs_by_status?.rejected || 0
      ],
      backgroundColor: ['#10B981', '#F59E0B', '#3B82F6', '#EF4444'],
      borderWidth: 2,
      borderColor: 'var(--bg-card)'
    }]
  };

  // Build map markers from providers with coordinates
  const providerMarkers = providers
    .filter(p => p.lat && p.lng)
    .map(p => ({
      lat: parseFloat(p.lat),
      lng: parseFloat(p.lng),
      type: 'provider',
      popup: `🏢 ${p.name}${p.company_name ? ` — ${p.company_name}` : ''}${p.address ? `\n📍 ${p.address}` : ''}`
    }));

  // Center map on first provider or default to Mangaluru
  const mapCenter = providerMarkers.length > 0
    ? [providerMarkers[0].lat, providerMarkers[0].lng]
    : [12.9141, 74.8560];

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 4px' }}>{t('admin_dashboard')}</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{t('admin_dashboard_desc')}</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard label={t('total_workers')}    value={total_workers}   icon="👷" color="rgba(59,130,246,0.15)" />
        <StatCard label={t('active_workers')}   value={active_workers}  icon="✅" color="rgba(16,185,129,0.15)" />
        <StatCard label={t('total_providers')}  value={total_providers} icon="🏢" color="rgba(139,92,246,0.15)" />
        <StatCard label={t('total_jobs')}       value={total_jobs}      icon="📋" color="rgba(245,158,11,0.15)" />
        <StatCard label={t('avg_rating')}       value={`${avg_rating} ⭐`} icon="🌟" color="rgba(239,68,68,0.15)" />
        <a href="/admin/verifications" style={{ textDecoration: 'none', color: 'inherit' }}>
          <StatCard label={t('pending_verifications')} value={pending_verifications || 0} icon="🛡️" color="rgba(59,130,246,0.15)" />
        </a>
      </div>

      {/* Map + Chart row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', marginBottom: '20px' }}>

        {/* Provider Locations Map */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <h3 style={{ margin: 0 }}>📍 {t('job_provider_locations')}</h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
                {providerMarkers.length} {providerMarkers.length !== 1 ? t('provider_plural') : t('provider_singular')} {t('visible_on_map')}
              </p>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '0.8rem', color: 'var(--text-secondary)',
              background: 'var(--bg-secondary)', padding: '4px 10px',
              borderRadius: '20px'
            }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#8B5CF6', display: 'inline-block' }} />
              {t('provider_legend')}
            </div>
          </div>

          {providerMarkers.length === 0 ? (
            <div style={{
              height: '360px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
              color: 'var(--text-muted)', gap: '12px'
            }}>
              <span style={{ fontSize: '3rem' }}>🗺️</span>
              <p style={{ margin: 0, fontWeight: 500 }}>{t('no_provider_locations')}</p>
              <p style={{ margin: 0, fontSize: '0.82rem' }}>{t('providers_appear_here')}</p>
            </div>
          ) : (
            <MapView
              center={mapCenter}
              zoom={12}
              markers={providerMarkers}
              height="360px"
            />
          )}
        </div>

        {/* Job Status Pie */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px' }}>{t('job_status')}</h3>
          <div style={{ height: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Pie
              data={pieData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { padding: 12, font: { size: 12 } } }
                }
              }}
            />
          </div>

          {/* Quick stats below chart */}
          <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { label: t('job_completed'), val: jobs_by_status?.completed || 0, color: '#10B981' },
              { label: t('job_pending'),   val: jobs_by_status?.pending   || 0, color: '#F59E0B' },
              { label: t('job_accepted'),  val: jobs_by_status?.accepted  || 0, color: '#3B82F6' },
              { label: t('job_rejected'),  val: jobs_by_status?.rejected  || 0, color: '#EF4444' },
            ].map(item => (
              <div key={item.label} style={{
                background: 'var(--bg-secondary)', borderRadius: 'var(--radius)',
                padding: '10px 12px', borderLeft: `3px solid ${item.color}`
              }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.label}</p>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '1.3rem' }}>{item.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Provider list below map */}
      {providers.length > 0 && (
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px' }}>{t('registered_providers_map')}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
            {providers.map(p => (
              <div key={p.id} style={{
                background: 'var(--bg-secondary)', borderRadius: 'var(--radius)',
                padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(139,92,246,0.2)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', fontWeight: 700, color: '#8B5CF6', flexShrink: 0
                }}>
                  {p.name?.[0]?.toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.name}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.company_name || p.address || t('no_details')}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {parseFloat(p.lat).toFixed(4)}, {parseFloat(p.lng).toFixed(4)}
                  </p>
                </div>
                {p.is_verified && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '2px 8px', borderRadius: '20px', flexShrink: 0 }}>
                    ✓ {t('verified_badge')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
