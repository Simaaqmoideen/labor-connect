import React, { useState, useContext, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const OTPVerify = () => {
  const [searchParams] = useSearchParams();
  const phone = searchParams.get('phone');
  const role = searchParams.get('role');
  const type = searchParams.get('type'); // login or register
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!phone || !role || !type) {
      navigate('/auth/role');
    }
  }, [phone, role, type, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (type === 'register') {
        const payloadStr = sessionStorage.getItem('temp_register_data');
        if (!payloadStr) throw new Error('Registration data lost, please try again');
        const payload = JSON.parse(payloadStr);
        
        const { data } = await authAPI.verifyOTPRegister({ phone, otp, ...payload });
        sessionStorage.removeItem('temp_register_data');
        login(data.token, data.user, role);
        toast.success('Registration successful');
        navigate(`/${role}/dashboard`);
        
      } else {
        const { data } = await authAPI.verifyOTPLogin({ phone, otp, role });
        login(data.token, data.user, role);
        toast.success('Login successful');
        navigate(`/${role}/dashboard`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-in" style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: '10px' }}>Verify Phone</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
          Enter the OTP sent to {phone}
        </p>

        <form onSubmit={handleVerify}>
          <div className="form-group">
            <input 
              type="text" 
              required 
              maxLength="6" 
              className="form-input" 
              style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '4px' }}
              value={otp} 
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} 
              placeholder="000000"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading || otp.length < 6}>
            {loading ? <LoadingSpinner /> : 'Verify & Continue'}
          </button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          For demo purposes, the OTP is 123456
        </p>
      </div>
    </div>
  );
};

export default OTPVerify;
