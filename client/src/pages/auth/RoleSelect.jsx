import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaBriefcase, FaHardHat } from 'react-icons/fa';

const RoleSelect = () => {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    navigate(`/auth/login?role=${role}`);
  };

  return (
    <div className="auth-container">
      <div style={{ width: '100%', maxWidth: '1000px' }} className="animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: 'white', fontSize: '3rem', fontWeight: 'bold', marginBottom: '10px' }}>
            Labor Connect
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem' }}>
            Connecting skilled workers with opportunities
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          
          <div className="card" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s', color: 'white' }} onClick={() => handleSelect('admin')} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <FaShieldAlt size={48} style={{ color: '#A78BFA', marginBottom: '20px' }} />
            <h2 style={{ marginBottom: '10px' }}>Admin</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>Platform management and analytics</p>
            <button className="btn" style={{ background: 'white', color: '#1E3A8A', width: '100%' }}>Get Started</button>
          </div>

          <div className="card" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s', color: 'white' }} onClick={() => handleSelect('provider')} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <FaBriefcase size={48} style={{ color: '#60A5FA', marginBottom: '20px' }} />
            <h2 style={{ marginBottom: '10px' }}>Job Provider</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>Hire skilled workers instantly</p>
            <button className="btn" style={{ background: 'white', color: '#1E3A8A', width: '100%' }}>Get Started</button>
          </div>

          <div className="card" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s', color: 'white' }} onClick={() => handleSelect('worker')} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <FaHardHat size={48} style={{ color: '#34D399', marginBottom: '20px' }} />
            <h2 style={{ marginBottom: '10px' }}>Worker</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>Find jobs and earn daily wages</p>
            <button className="btn" style={{ background: 'white', color: '#1E3A8A', width: '100%' }}>Get Started</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoleSelect;
