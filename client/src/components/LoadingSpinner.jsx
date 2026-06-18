import React from 'react';

const LoadingSpinner = ({ fullScreen = false }) => {
  const spinnerStyle = {
    display: 'inline-block',
    width: '40px',
    height: '40px',
    border: '4px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '50%',
    borderTopColor: 'var(--accent-blue)',
    animation: 'spin 1s ease-in-out infinite'
  };

  const containerStyle = fullScreen ? {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--bg-primary)', zIndex: 9999
  } : {
    display: 'flex', justifyContent: 'center', padding: '40px'
  };

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={containerStyle}>
        <div style={spinnerStyle}></div>
      </div>
    </>
  );
};

export default LoadingSpinner;
