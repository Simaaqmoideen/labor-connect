import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { workerAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const SKILLS_OPTIONS = ['Mason', 'Carpenter', 'Electrician', 'Plumber', 'Painter', 'Welder', 'Driver', 'Cleaner', 'Gardener', 'Security'];
const LANGUAGES = ['Kannada', 'Hindi', 'English', 'Tamil', 'Telugu', 'Marathi'];

const MyProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    bio: '',
    skills: [],
    languages: [],
    dailyRate: 500,
    available: true,
    experience: 0,
    photo: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await workerAPI.getProfile();
        const p = res.data.worker || {};
        setProfile({
          name: p.name || user?.name || '',
          phone: p.phone || '',
          bio: p.bio || '',
          skills: p.skills || [],
          languages: p.languages || [],
          dailyRate: p.dailyRate || 500,
          available: p.available !== undefined ? p.available : true,
          experience: p.experience || 0,
          photo: p.photo || null,
        });
        if (p.photo) setPhotoPreview(p.photo);
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const toggleSkill = (skill) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const toggleLanguage = (lang) => {
    setProfile(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const formData = new FormData();
      Object.entries(profile).forEach(([key, val]) => {
        if (key === 'skills' || key === 'languages') {
          formData.append(key, JSON.stringify(val));
        } else if (key !== 'photo') {
          formData.append(key, val);
        }
      });
      if (photoFile) formData.append('photo', photoFile);
      const res = await workerAPI.updateProfile(formData);
      toast.success('Profile updated!');
      if (res.data.worker && setUser) setUser(prev => ({ ...prev, ...res.data.worker }));
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="my-profile-page">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Keep your profile up to date to get more job opportunities</p>
      </div>

      <form onSubmit={handleSave} className="profile-form">
        {/* Photo Upload */}
        <div className="profile-photo-section card">
          <div className="photo-upload">
            <div className="avatar avatar-xl">
              {photoPreview
                ? <img src={photoPreview} alt="Profile" />
                : <span>{profile.name?.[0]?.toUpperCase() || 'W'}</span>
              }
            </div>
            <div>
              <label className="btn btn-outline" htmlFor="photoInput">📷 Change Photo</label>
              <input id="photoInput" type="file" accept="image/*" hidden onChange={handlePhotoChange} />
              <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>JPG, PNG up to 5MB</p>
            </div>
          </div>

          <div className="availability-toggle">
            <span className={`availability-label ${profile.available ? 'available' : 'unavailable'}`}>
              {profile.available ? '🟢 Available for Work' : '🔴 Not Available'}
            </span>
            <label className="switch">
              <input
                type="checkbox"
                checked={profile.available}
                onChange={e => setProfile(p => ({ ...p, available: e.target.checked }))}
              />
              <span className="slider" />
            </label>
          </div>
        </div>

        {/* Basic Info */}
        <div className="card profile-section">
          <h2 className="section-title">Basic Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                className="form-control"
                value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                className="form-control"
                value={profile.phone}
                onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Daily Rate (₹)</label>
              <input
                type="number"
                className="form-control"
                value={profile.dailyRate}
                min={100}
                onChange={e => setProfile(p => ({ ...p, dailyRate: Number(e.target.value) }))}
              />
            </div>
            <div className="form-group">
              <label>Years of Experience</label>
              <input
                type="number"
                className="form-control"
                value={profile.experience}
                min={0}
                onChange={e => setProfile(p => ({ ...p, experience: Number(e.target.value) }))}
              />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Bio / About</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Tell providers about yourself..."
                value={profile.bio}
                onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                maxLength={300}
              />
              <div className="char-count">{profile.bio.length}/300</div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="card profile-section">
          <h2 className="section-title">Skills</h2>
          <div className="skills-selector">
            {SKILLS_OPTIONS.map(skill => (
              <button
                key={skill}
                type="button"
                className={`skill-pill ${profile.skills.includes(skill) ? 'active' : ''}`}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
          {profile.skills.length === 0 && (
            <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Select at least one skill</p>
          )}
        </div>

        {/* Languages */}
        <div className="card profile-section">
          <h2 className="section-title">Languages Spoken</h2>
          <div className="skills-selector">
            {LANGUAGES.map(lang => (
              <button
                key={lang}
                type="button"
                className={`skill-pill ${profile.languages.includes(lang) ? 'active' : ''}`}
                onClick={() => toggleLanguage(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : '💾 Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyProfile;
