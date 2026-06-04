import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaMoon, FaSun, FaHardHat } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import NotificationBell from './NotificationBell';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { user, role, logout, isAuthenticated } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <nav style={{ 
      background: 'var(--bg-card)', 
      borderBottom: '1px solid var(--border-color)', 
      padding: '0 20px', 
      height: '70px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
        <div style={{ background: 'var(--accent-blue)', color: 'white', padding: '8px', borderRadius: '8px', display: 'flex' }}>
          <FaHardHat />
        </div>
        {t('app_name')}
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {isAuthenticated && (
          <>
            <Link to={`/${role}/dashboard`} style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{t('nav_dashboard')}</Link>
            {role === 'provider' && <Link to="/provider/jobs" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{t('nav_jobs')}</Link>}
            {role === 'worker' && <Link to="/worker/jobs" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{t('nav_jobs')}</Link>}
          </>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
          <LanguageSwitcher />
          
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>

          {isAuthenticated ? (
            <>
              <NotificationBell />
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <button onClick={logout} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>{t('nav_logout')}</button>
              </div>
            </>
          ) : (
            <Link to="/auth/login" className="btn btn-primary" style={{ padding: '8px 16px' }}>{t('login_btn')}</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
