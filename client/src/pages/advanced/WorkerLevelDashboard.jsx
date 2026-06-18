import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LevelBadge from '../../components/advanced/LevelBadge';
import ProgressRing from '../../components/advanced/ProgressRing';
import AchievementCard from '../../components/advanced/AchievementCard';

const WorkerLevelDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLevelData();
  }, []);

  const fetchLevelData = async () => {
    try {
      const res = await api.get('/level/progress');
      setData(res.data);
    } catch (error) {
      console.error('Error fetching level data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page-container"><p>Loading level dashboard...</p></div>;
  if (!data) return <div className="page-container"><p>Error loading data.</p></div>;

  const { level, points, meta, achievements, milestones, recommendations, nextLevel } = data;

  return (
    <div className="page-container" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Career Growth & Level</h2>
        <LevelBadge level={level} points={points} showGlow />
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {/* Progress Card */}
        <div className="dashboard-card" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <ProgressRing 
            radius={60} stroke={8} 
            progress={nextLevel ? nextLevel.progressPercent : 100}
            color={`var(--accent-blue)`}
          >
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{meta.emoji}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{points} pt</span>
          </ProgressRing>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 8px 0' }}>{meta.label}</h3>
            {nextLevel ? (
              <>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem' }}>
                  {nextLevel.pointsNeeded} points needed for {nextLevel.meta.label}
                </p>
                <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${nextLevel.progressPercent}%`, height: '100%', background: 'var(--accent-blue)' }} />
                </div>
              </>
            ) : (
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--accent-green)' }}>Maximum Level Reached!</p>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="dashboard-card">
          <h3 style={{ marginTop: 0 }}>Career Recommendations</h3>
          {recommendations.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recommendations.map((rec, i) => (
                <li key={i} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{rec}</li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0, color: 'var(--accent-green)' }}>You're doing great! Keep it up.</p>
          )}
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h3>Milestones</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {milestones.map((m, i) => (
            <div key={i} style={{
              padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)',
              background: m.done ? 'rgba(16,185,129,0.1)' : 'var(--bg-secondary)',
              opacity: m.done ? 1 : 0.6,
              display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <span style={{ fontSize: '1.5rem' }}>{m.icon}</span>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{m.title}</div>
                {!m.done && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.remaining} remaining</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h3>Recent Achievements</h3>
        {achievements.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {achievements.map(ach => (
              <AchievementCard key={ach.id} achievement={ach} />
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>Complete jobs to earn achievements!</p>
        )}
      </div>
    </div>
  );
};

export default WorkerLevelDashboard;
