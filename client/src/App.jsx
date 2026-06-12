import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from './context/AuthContext';

import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

// Auth
import RoleSelect from './pages/auth/RoleSelect';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import OTPVerify from './pages/auth/OTPVerify';

// Worker
import WorkerDashboard from './pages/worker/WorkerDashboard';
import WorkerJobs from './pages/worker/WorkerJobs';
import MyProfile from './pages/worker/MyProfile';
import IncomingRequest from './pages/worker/IncomingRequest';
import WorkerChat from './pages/worker/Chat';

// Provider
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderJobs from './pages/provider/ProviderJobs';
import PostJob from './pages/provider/PostJob';
import SearchWorkers from './pages/provider/SearchWorkers';
import RateWorker from './pages/provider/RateWorker';
import ProviderChat from './pages/provider/Chat';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageWorkers from './pages/admin/ManageWorkers';
import ManageProviders from './pages/admin/ManageProviders';
import ManageJobs from './pages/admin/ManageJobs';
import ManageReviews from './pages/admin/ManageReviews';
import SiteSettings from './pages/admin/SiteSettings';

// Advanced Features
import WorkerLevelDashboard from './pages/advanced/WorkerLevelDashboard';
import WorkerVerifications from './pages/advanced/WorkerVerifications';
import AdminVerifications from './pages/advanced/AdminVerifications';
import PredictiveDemand from './pages/admin/PredictiveDemand';
import WorkerTrustIndex from './pages/admin/WorkerTrustIndex';
import RevenueImpact from './pages/admin/RevenueImpact';
import WeatherScheduling from './pages/advanced/WeatherScheduling';
import WorkVerificationPage from './pages/advanced/WorkVerificationPage';
import AccommodationFinder from './pages/advanced/AccommodationFinder';
import AIAssistant from './components/advanced/AIAssistant';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useContext(AuthContext);
  if (loading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return <Navigate to="/auth/role" />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" />;
  return children;
};

const App = () => {
  const [aiChatOpen, setAiChatOpen] = useState(false);
  
  return (
    <BrowserRouter>
      <div className="page-wrapper">
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/auth/role" />} />

            {/* Auth */}
            <Route path="/auth/role" element={<RoleSelect />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/verify-otp" element={<OTPVerify />} />

            {/* Worker */}
            <Route path="/worker/dashboard" element={<PrivateRoute allowedRoles={['worker']}><WorkerDashboard /></PrivateRoute>} />
            <Route path="/worker/jobs" element={<PrivateRoute allowedRoles={['worker']}><WorkerJobs /></PrivateRoute>} />
            <Route path="/worker/profile" element={<PrivateRoute allowedRoles={['worker']}><MyProfile /></PrivateRoute>} />
            <Route path="/worker/chat/:id" element={<PrivateRoute allowedRoles={['worker']}><WorkerChat /></PrivateRoute>} />
            <Route path="/worker/incoming-request/:id" element={<PrivateRoute allowedRoles={['worker']}><IncomingRequest /></PrivateRoute>} />
            <Route path="/worker/level" element={<PrivateRoute allowedRoles={['worker']}><WorkerLevelDashboard /></PrivateRoute>} />
            <Route path="/worker/verifications" element={<PrivateRoute allowedRoles={['worker']}><WorkerVerifications /></PrivateRoute>} />
            <Route path="/worker/accommodations" element={<PrivateRoute allowedRoles={['worker']}><AccommodationFinder /></PrivateRoute>} />
            <Route path="/work-verify/:id" element={<PrivateRoute allowedRoles={['worker', 'provider']}><WorkVerificationPage /></PrivateRoute>} />

            {/* Provider */}
            <Route path="/provider/dashboard" element={<PrivateRoute allowedRoles={['provider']}><ProviderDashboard /></PrivateRoute>} />
            <Route path="/provider/jobs" element={<PrivateRoute allowedRoles={['provider']}><ProviderJobs /></PrivateRoute>} />
            <Route path="/provider/jobs/new" element={<PrivateRoute allowedRoles={['provider']}><PostJob /></PrivateRoute>} />
            <Route path="/provider/search" element={<PrivateRoute allowedRoles={['provider']}><SearchWorkers /></PrivateRoute>} />
            <Route path="/provider/rate/:id" element={<PrivateRoute allowedRoles={['provider']}><RateWorker /></PrivateRoute>} />
            <Route path="/provider/chat/:id" element={<PrivateRoute allowedRoles={['provider']}><ProviderChat /></PrivateRoute>} />
            <Route path="/provider/weather" element={<PrivateRoute allowedRoles={['provider']}><WeatherScheduling /></PrivateRoute>} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/workers" element={<PrivateRoute allowedRoles={['admin']}><ManageWorkers /></PrivateRoute>} />
            <Route path="/admin/providers" element={<PrivateRoute allowedRoles={['admin']}><ManageProviders /></PrivateRoute>} />
            <Route path="/admin/jobs" element={<PrivateRoute allowedRoles={['admin']}><ManageJobs /></PrivateRoute>} />
            <Route path="/admin/reviews" element={<PrivateRoute allowedRoles={['admin']}><ManageReviews /></PrivateRoute>} />
            <Route path="/admin/settings" element={<PrivateRoute allowedRoles={['admin']}><SiteSettings /></PrivateRoute>} />
            <Route path="/admin/verifications" element={<PrivateRoute allowedRoles={['admin']}><AdminVerifications /></PrivateRoute>} />
            <Route path="/admin/predictive-demand" element={<PrivateRoute allowedRoles={['admin']}><PredictiveDemand /></PrivateRoute>} />
            <Route path="/admin/worker-trust" element={<PrivateRoute allowedRoles={['admin']}><WorkerTrustIndex /></PrivateRoute>} />
            <Route path="/admin/revenue-impact" element={<PrivateRoute allowedRoles={['admin']}><RevenueImpact /></PrivateRoute>} />
          </Routes>
        </main>

        <AuthContext.Consumer>
          {({ isAuthenticated }) => isAuthenticated && (
            <>
              <AIAssistant isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />
              {!aiChatOpen && (
                <button className="ai-chat-btn" onClick={() => setAiChatOpen(true)}>
                  🤖
                </button>
              )}
            </>
          )}
        </AuthContext.Consumer>
      </div>
      <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'Inter, sans-serif' } }} />
    </BrowserRouter>
  );
};

export default App;
