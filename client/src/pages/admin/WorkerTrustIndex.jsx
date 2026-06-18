import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaShieldAlt, FaMedal, FaExclamationCircle, FaStar, FaUserCheck, FaRobot } from 'react-icons/fa';

const WorkerTrustIndex = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [workers, setWorkers] = useState([]);
  const [aiActions, setAiActions] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setWorkers([
        { id: 1, name: 'Rahul Sharma', role: 'Electrician', trustScore: 98, level: 'Elite', jobs: 145, rating: 4.9, attendance: '100%', complaints: 0, verified: true },
        { id: 2, name: 'Anita Kumar', role: 'Plumber', trustScore: 92, level: 'Trusted', jobs: 89, rating: 4.8, attendance: '98%', complaints: 1, verified: true },
        { id: 3, name: 'Vikram Singh', role: 'Carpenter', trustScore: 75, level: 'Standard', jobs: 34, rating: 4.2, attendance: '90%', complaints: 2, verified: false },
        { id: 4, name: 'Priya Patel', role: 'General Labor', trustScore: 45, level: 'At Risk', jobs: 12, rating: 3.5, attendance: '80%', complaints: 4, verified: false },
        { id: 5, name: 'Ramesh Gupta', role: 'Mason', trustScore: 88, level: 'Trusted', jobs: 210, rating: 4.7, attendance: '95%', complaints: 3, verified: true }
      ]);

      setAiActions([
        { type: 'reward', text: 'Promote Rahul Sharma to "Platform Ambassador" for maintaining a 98 Trust Score over 6 months.' },
        { type: 'warning', text: 'Flag Priya Patel for mandatory re-orientation due to a drop in punctuality and 4 recent complaints.' },
        { type: 'action', text: 'Send verification reminder to Vikram Singh; verifying ID will boost his Trust Score to "Trusted" level.' }
      ]);

      setLoading(false);
    }, 800);
  }, []);

  const getScoreColor = (score) => {
    if (score >= 90) return '#10B981'; // Green
    if (score >= 70) return '#3B82F6'; // Blue
    if (score >= 50) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const getLevelBadge = (level) => {
    const colors = {
      'Elite': { bg: 'rgba(16, 185, 129, 0.15)', color: '#10B981', icon: <FaMedal /> },
      'Trusted': { bg: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', icon: <FaShieldAlt /> },
      'Standard': { bg: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', icon: <FaUserCheck /> },
      'At Risk': { bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', icon: <FaExclamationCircle /> }
    };
    const style = colors[level];
    return (
      <span style={{ 
        background: style.bg, color: style.color, 
        padding: '6px 12px', borderRadius: '20px', 
        fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' 
      }}>
        {style.icon} {level}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <FaShieldAlt style={{ fontSize: '3rem', marginBottom: '10px', animation: 'pulse 2s infinite' }} />
        <h2>Calculating Trust Scores...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaShieldAlt style={{ color: '#8B5CF6' }} /> Worker Trust Index
        </h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Dynamically computed trust scores based on performance, attendance, ratings, and complaints.</p>
      </div>

      {/* AI Recommendations */}
      <div className="card" style={{ padding: '20px', marginBottom: '24px', background: 'linear-gradient(145deg, var(--bg-card) 0%, rgba(139, 92, 246, 0.05) 100%)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
        <h3 style={{ margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#8B5CF6' }}>
          <FaRobot /> AI Interventions & Rewards
        </h3>
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '10px' }}>
          {aiActions.map((action, idx) => (
            <div key={idx} style={{
              background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', minWidth: '300px', flex: 1,
              borderLeft: `4px solid ${action.type === 'reward' ? '#10B981' : action.type === 'warning' ? '#EF4444' : '#3B82F6'}`
            }}>
              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>{action.text}</p>
              <button className="btn btn-primary" style={{ marginTop: '12px', padding: '6px 16px', fontSize: '0.8rem' }}>
                {action.type === 'reward' ? 'Approve Reward' : action.type === 'warning' ? 'Issue Warning' : 'Take Action'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Index Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Trust Score Rankings</h3>
          <input type="text" placeholder="Search workers..." className="input-field" style={{ width: '250px', padding: '8px 16px' }} />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--bg-secondary)' }}>
              <tr>
                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Worker</th>
                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Trust Score</th>
                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Trust Level</th>
                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Jobs</th>
                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Rating</th>
                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Attendance</th>
                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Issues</th>
              </tr>
            </thead>
            <tbody>
              {workers.sort((a, b) => b.trustScore - a.trustScore).map(worker => (
                <tr key={worker.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {worker.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {worker.name}
                          {worker.verified && <span style={{ color: '#10B981', fontSize: '0.8rem' }} title="Verified User">✓</span>}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{worker.role}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: getScoreColor(worker.trustScore) }}>{worker.trustScore}</div>
                      <div style={{ width: '60px', height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${worker.trustScore}%`, height: '100%', background: getScoreColor(worker.trustScore) }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>{getLevelBadge(worker.level)}</td>
                  <td style={{ padding: '16px', fontWeight: 500 }}>{worker.jobs}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaStar style={{ color: '#F59E0B' }} /> {worker.rating}
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontWeight: 500 }}>{worker.attendance}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      color: worker.complaints === 0 ? '#10B981' : worker.complaints > 2 ? '#EF4444' : '#F59E0B',
                      fontWeight: 600 
                    }}>
                      {worker.complaints} {worker.complaints === 1 ? 'Complaint' : 'Complaints'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkerTrustIndex;
