import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const SiteSettings = () => {
  const [settings, setSettings] = useState({
    platformName: 'Labor Connect',
    supportEmail: 'support@laborconnect.in',
    defaultCurrency: 'INR',
    minWage: 300,
    maxWage: 2000,
    otpEnabled: true,
    maintenanceMode: false,
    registrationOpen: true,
    maxJobRadius: 50,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminAPI.getSettings();
        if (res.data.settings) setSettings(res.data.settings);
      } catch {
        // Use defaults if API not available
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await adminAPI.updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="page-title">Site Settings</h1>
        <p className="page-subtitle">Configure global platform behavior</p>
      </div>

      <form onSubmit={handleSave} className="settings-form">
        {/* General Settings */}
        <div className="settings-section card">
          <h2 className="section-title">🌐 General</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Platform Name</label>
              <input
                className="form-control"
                value={settings.platformName}
                onChange={e => handleChange('platformName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Support Email</label>
              <input
                type="email"
                className="form-control"
                value={settings.supportEmail}
                onChange={e => handleChange('supportEmail', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Default Currency</label>
              <select
                className="form-control"
                value={settings.defaultCurrency}
                onChange={e => handleChange('defaultCurrency', e.target.value)}
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Max Job Radius (km)</label>
              <input
                type="number"
                className="form-control"
                value={settings.maxJobRadius}
                onChange={e => handleChange('maxJobRadius', Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Wage Settings */}
        <div className="settings-section card">
          <h2 className="section-title">💰 Wage Limits</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Minimum Daily Wage (₹)</label>
              <input
                type="number"
                className="form-control"
                value={settings.minWage}
                onChange={e => handleChange('minWage', Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Maximum Daily Wage (₹)</label>
              <input
                type="number"
                className="form-control"
                value={settings.maxWage}
                onChange={e => handleChange('maxWage', Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="settings-section card">
          <h2 className="section-title">⚙️ Feature Toggles</h2>
          <div className="toggles-list">
            {[
              { key: 'otpEnabled', label: 'OTP Login', desc: 'Allow users to login via OTP' },
              { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Block public access to the site', danger: true },
              { key: 'registrationOpen', label: 'Open Registration', desc: 'Allow new users to register' },
            ].map(({ key, label, desc, danger }) => (
              <div key={key} className={`toggle-row ${danger && settings[key] ? 'toggle-danger' : ''}`}>
                <div>
                  <div className="toggle-label">{label}</div>
                  <div className="toggle-desc">{desc}</div>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings[key]}
                    onChange={e => handleChange(key, e.target.checked)}
                  />
                  <span className="slider" />
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : '💾 Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SiteSettings;
