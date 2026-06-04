import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import useNotifications from '../hooks/useNotifications';

const NotificationBell = () => {
  const { notifications, markRead, clearAll } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', fontSize: '1.2rem', color: 'var(--text-secondary)' }}
      >
        <FaBell />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '-5px', right: '-5px',
            background: 'var(--accent-red)', color: 'white', borderRadius: '50%',
            padding: '2px 6px', fontSize: '0.7rem', fontWeight: 'bold'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, width: '300px',
          background: 'var(--bg-card)', border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 50,
          marginTop: '10px', overflow: 'hidden'
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '1rem' }}>Notifications</h4>
            {notifications.length > 0 && (
              <button onClick={clearAll} style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', fontSize: '0.8rem' }}>
                Clear All
              </button>
            )}
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No notifications</div>
            ) : (
              notifications.map((n, i) => (
                <div key={i} 
                  onClick={() => markRead(n.id)}
                  style={{ 
                    padding: '12px 16px', borderBottom: '1px solid var(--border-color)', 
                    background: n.is_read ? 'transparent' : 'rgba(59, 130, 246, 0.05)',
                    cursor: 'pointer'
                  }}
                >
                  <p style={{ margin: '0 0 4px', fontWeight: n.is_read ? 400 : 600, fontSize: '0.9rem' }}>{n.title}</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{n.body}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
