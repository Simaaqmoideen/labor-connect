import React from 'react';

const ConfirmModal = ({ isOpen, title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, isDanger = false }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px', margin: '20px' }}>
        <h3 style={{ margin: '0 0 10px' }}>{title}</h3>
        <p style={{ margin: '0 0 20px', color: 'var(--text-secondary)' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onCancel} className="btn btn-secondary">{cancelText}</button>
          <button onClick={onConfirm} className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
