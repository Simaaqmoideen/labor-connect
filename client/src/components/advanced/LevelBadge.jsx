import React from 'react';

const LevelBadge = ({ level, points, showGlow = false }) => {
  const meta = {
    bronze: { label: 'Bronze', emoji: '🥉' },
    silver: { label: 'Silver', emoji: '🥈' },
    gold: { label: 'Gold', emoji: '🥇' },
    platinum: { label: 'Platinum', emoji: '💎' }
  };

  const l = level?.toLowerCase() || 'bronze';
  const data = meta[l] || meta.bronze;

  return (
    <div className={`level-badge level-badge-${l} ${showGlow ? 'level-badge-glow' : ''}`}>
      <span>{data.emoji}</span>
      <span>{data.label}</span>
      {points !== undefined && <span style={{ opacity: 0.8, marginLeft: '4px' }}>• {points} pt</span>}
    </div>
  );
};

export default LevelBadge;
