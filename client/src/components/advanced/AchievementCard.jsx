import React from 'react';

const AchievementCard = ({ achievement }) => {
  return (
    <div className="achievement-card">
      <div className="achievement-icon">
        {achievement.icon || '🏆'}
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>
          {achievement.title}
        </h4>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {achievement.description}
        </p>
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
        {new Date(achievement.earned_at).toLocaleDateString()}
      </div>
    </div>
  );
};

export default AchievementCard;
