import React from 'react';

const ConfidenceGauge = ({ score }) => {
  const percentage = parseFloat(score) || 0;
  
  let color = 'var(--accent-red)';
  if (percentage >= 75) color = 'var(--accent-green)';
  else if (percentage >= 40) color = 'var(--accent-amber)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ position: 'relative', width: '150px', height: '75px', overflow: 'hidden' }}>
        <div style={{
          width: '150px', height: '150px', borderRadius: '50%',
          border: '15px solid var(--border-color)', borderBottomColor: 'transparent',
          borderLeftColor: 'transparent', transform: 'rotate(-45deg)', position: 'absolute', top: 0
        }} />
        <div style={{
          width: '150px', height: '150px', borderRadius: '50%',
          border: `15px solid ${color}`, borderBottomColor: 'transparent',
          borderLeftColor: 'transparent', position: 'absolute', top: 0,
          transform: `rotate(${ -45 + (percentage / 100) * 180 }deg)`,
          transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)'
        }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-15px' }}>
        <span style={{ fontSize: '1.8rem', fontWeight: '800', color }}>{percentage.toFixed(0)}%</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Confidence</span>
      </div>
    </div>
  );
};

export default ConfidenceGauge;
