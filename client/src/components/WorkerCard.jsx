import React from 'react';
import StarRating from './StarRating';
import { FaCheckCircle, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';
import LevelBadge from './advanced/LevelBadge';
import VerificationBadge from './advanced/VerificationBadge';

const WorkerCard = ({ worker, onSendJob, onSelect, showContact }) => {
  const { name, category, skills, rating_avg, rating_count, availability, is_verified, photo_url, wage_per_day, experience_yrs, distance, phone, level, verification_badges } = worker;

  let skillsList = [];
  try {
    skillsList = typeof skills === 'string' ? JSON.parse(skills) : (skills || []);
  } catch (e) {
    skillsList = typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : [];
  }

  return (
    <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
        <div style={{ 
          width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-secondary)', 
          overflow: 'hidden', flexShrink: 0, border: '2px solid var(--border-color)' 
        }}>
          {photo_url ? (
            <img src={photo_url.startsWith('http') ? photo_url : `http://localhost:5000${photo_url}`} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
              {name.charAt(0)}
            </div>
          )}
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {name}
              {is_verified && <FaCheckCircle color="var(--accent-green)" size={14} title="Verified" />}
            </h3>
            <span className={`badge badge-${availability}`}>{availability}</span>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <LevelBadge level={level} />
          </div>
          <p style={{ margin: '0 0 8px', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FaBriefcase size={12} /> {category} • {experience_yrs} yrs exp
          </p>
          <StarRating rating={rating_avg} count={rating_count} />
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {skillsList.slice(0, 3).map((skill, i) => (
          <span key={i} style={{ background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {skill}
          </span>
        ))}
        {skillsList.length > 3 && (
          <span style={{ padding: '2px 8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>+{skillsList.length - 3}</span>
        )}
      </div>

      {(verification_badges && verification_badges.length > 0) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
          {verification_badges.map((badge, i) => (
            <VerificationBadge key={i} label={badge} />
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
        <div>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>₹{wage_per_day}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/day</span>
        </div>
        
        {distance !== undefined && (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FaMapMarkerAlt /> {distance.toFixed(1)} km
          </div>
        )}
      </div>

      {showContact && (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', padding: '8px', borderRadius: '4px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 500 }}>
          Phone: {phone}
        </div>
      )}

      {onSendJob && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          {onSelect && <button onClick={() => onSelect(worker)} className="btn btn-secondary" style={{ flex: 1 }}>View Profile</button>}
          <button onClick={() => onSendJob(worker)} className="btn btn-primary" style={{ flex: 2 }}>Send Request</button>
        </div>
      )}
    </div>
  );
};

export default WorkerCard;
