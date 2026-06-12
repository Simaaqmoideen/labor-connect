import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaBriefcase, FaHardHat } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const RoleSelect = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSelect = (role) => {
    navigate(`/auth/login?role=${role}`);
  };

  return (
    <div className="auth-container">
      <div style={{ width: '100%', maxWidth: '1000px' }} className="animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: 'white', fontSize: '3rem', fontWeight: 'bold', marginBottom: '10px' }}>
            {t('app_name')}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem' }}>
            {t('tagline')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          
          <div className="card" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s', color: 'white' }} onClick={() => handleSelect('admin')} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <FaShieldAlt size={48} style={{ color: '#A78BFA', marginBottom: '20px' }} />
            <h2 style={{ marginBottom: '10px' }}>{t('role_admin')}</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>{t('role_admin_desc')}</p>
            <button className="btn" style={{ background: 'white', color: '#1E3A8A', width: '100%' }}>{t('get_started')}</button>
          </div>

          <div className="card" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s', color: 'white' }} onClick={() => handleSelect('provider')} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <FaBriefcase size={48} style={{ color: '#60A5FA', marginBottom: '20px' }} />
            <h2 style={{ marginBottom: '10px' }}>{t('role_provider')}</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>{t('role_provider_desc')}</p>
            <button className="btn" style={{ background: 'white', color: '#1E3A8A', width: '100%' }}>{t('get_started')}</button>
          </div>

          <div className="card" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s', color: 'white' }} onClick={() => handleSelect('worker')} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <FaHardHat size={48} style={{ color: '#34D399', marginBottom: '20px' }} />
            <h2 style={{ marginBottom: '10px' }}>{t('role_worker')}</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>{t('role_worker_desc')}</p>
            <button className="btn" style={{ background: 'white', color: '#1E3A8A', width: '100%' }}>{t('get_started')}</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoleSelect;
