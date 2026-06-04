import React, { useState, useContext } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const Register = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'worker';
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const [method, setMethod] = useState('password');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    company_name: '', category: '', skills: '', wage_per_day: '', working_area: ''
  });

  const handlePasswordRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    setLoading(true);
    try {
      const payload = { ...formData, role };
      if (role === 'worker' && typeof payload.skills === 'string') {
        payload.skills = payload.skills.split(',').map(s => s.trim()).filter(s => s);
      }
      
      const { data } = await authAPI.register(payload);
      login(data.token, data.user, role);
      toast.success('Registration successful');
      navigate(`/${role}/dashboard`);
    } catch (error) {
      if (!error.response) {
        toast.error('Network Error: Cannot connect to server. Is the backend running?');
      } else {
        toast.error(error.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOTPRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.sendOTP(formData.phone);
      toast.success('OTP sent (use 123456 for demo)');
      
      const payload = { ...formData, role };
      if (role === 'worker' && typeof payload.skills === 'string') {
        payload.skills = payload.skills.split(',').map(s => s.trim()).filter(s => s);
      }
      
      // Store temp data in session storage for the verify page
      sessionStorage.setItem('temp_register_data', JSON.stringify(payload));
      navigate(`/auth/verify-otp?role=${role}&phone=${encodeURIComponent(formData.phone)}&type=register`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-in" style={{ maxWidth: '600px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span className="badge" style={{ background: 'var(--accent-green)', color: 'white', marginBottom: '10px' }}>
            {role.toUpperCase()}
          </span>
          <h2 style={{ margin: 0 }}>Create Account</h2>
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

        <form onSubmit={method === 'password' ? handlePasswordRegister : handleOTPRegister}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Full Name</label>
              <input type="text" required className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="tel" required className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>

            {method === 'password' && (
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" required className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            )}

            {role === 'provider' && (
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Company Name (Optional)</label>
                <input type="text" className="form-input" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} />
              </div>
            )}

            {role === 'worker' && (
              <>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select required className="form-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="">Select Category</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Painter">Painter</option>
                    <option value="Mason">Mason</option>
                    <option value="Helper">Helper</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Wage (₹/day)</label>
                  <input type="number" required className="form-input" value={formData.wage_per_day} onChange={e => setFormData({...formData, wage_per_day: e.target.value})} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Skills (comma separated)</label>
                  <input type="text" className="form-input" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} placeholder="e.g. Wiring, Installation" />
                </div>
              </>
            )}

            {method === 'password' && (
              <>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input type="password" required className="form-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input type="password" required className="form-input" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
                </div>
              </>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} disabled={loading}>
            {loading ? <LoadingSpinner /> : (method === 'password' ? 'Register' : 'Send OTP')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to={`/auth/login?role=${role}`} style={{ color: 'var(--text-secondary)' }}>
            Already have an account? <span style={{ color: 'var(--accent-blue)' }}>Login here</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
