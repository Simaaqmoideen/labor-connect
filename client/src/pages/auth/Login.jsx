import React, { useState, useContext } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const Login = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'worker';
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const [method, setMethod] = useState('password'); // 'password' or 'otp'
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', phone: '' });

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login({ role, email: formData.email, password: formData.password });
      login(data.token, data.user, role);
      toast.success('Login successful');
      navigate(`/${role}/dashboard`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.sendOTP(formData.phone);
      toast.success('OTP sent (use 123456 for demo)');
      navigate(`/auth/verify-otp?role=${role}&phone=${encodeURIComponent(formData.phone)}&type=login`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span className="badge" style={{ background: 'var(--accent-blue)', color: 'white', marginBottom: '10px' }}>
            {role.toUpperCase()}
          </span>
          <h2 style={{ margin: 0 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Login to your account</p>
        </div>

        <div style={{ display: 'flex', marginBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
          <button 
            style={{ flex: 1, padding: '10px', background: 'none', border: 'none', borderBottom: method === 'password' ? '2px solid var(--accent-blue)' : '2px solid transparent', color: method === 'password' ? 'var(--accent-blue)' : 'var(--text-secondary)', fontWeight: method === 'password' ? 600 : 400, cursor: 'pointer' }}
            onClick={() => setMethod('password')}
          >
            Password
          </button>
          <button 
            style={{ flex: 1, padding: '10px', background: 'none', border: 'none', borderBottom: method === 'otp' ? '2px solid var(--accent-blue)' : '2px solid transparent', color: method === 'otp' ? 'var(--accent-blue)' : 'var(--text-secondary)', fontWeight: method === 'otp' ? 600 : 400, cursor: 'pointer' }}
            onClick={() => setMethod('otp')}
          >
            OTP
          </button>
        </div>

        {method === 'password' ? (
          <form onSubmit={handlePasswordLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" required className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" required className="form-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
              {loading ? <LoadingSpinner /> : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSendOTP}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" required className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="e.g. 9876543210" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
              {loading ? <LoadingSpinner /> : 'Send OTP'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to={`/auth/register?role=${role}`} style={{ color: 'var(--text-secondary)' }}>
            Don't have an account? <span style={{ color: 'var(--accent-blue)' }}>Register here</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
