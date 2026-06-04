import React, { useContext } from 'react';
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

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useContext(AuthContext);
  if (loading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return <Navigate to="/auth/role" />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" />;
  return children;
};

const App = () => {
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
            <Route path="/worker/request/:jobId" element={<PrivateRoute allowedRoles={['worker']}><IncomingRequest /></PrivateRoute>} />
            <Route path="/worker/chat" element={<PrivateRoute allowedRoles={['worker']}><WorkerChat /></PrivateRoute>} />

            {/* Provider */}
            <Route path="/provider/dashboard" element={<PrivateRoute allowedRoles={['provider']}><ProviderDashboard /></PrivateRoute>} />
            <Route path="/provider/jobs" element={<PrivateRoute allowedRoles={['provider']}><ProviderJobs /></PrivateRoute>} />
            <Route path="/provider/jobs/new" element={<PrivateRoute allowedRoles={['provider']}><PostJob /></PrivateRoute>} />
            <Route path="/provider/search" element={<PrivateRoute allowedRoles={['provider']}><SearchWorkers /></PrivateRoute>} />
            <Route path="/provider/rate" element={<PrivateRoute allowedRoles={['provider']}><RateWorker /></PrivateRoute>} />
            <Route path="/provider/chat" element={<PrivateRoute allowedRoles={['provider']}><ProviderChat /></PrivateRoute>} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/workers" element={<PrivateRoute allowedRoles={['admin']}><ManageWorkers /></PrivateRoute>} />
            <Route path="/admin/providers" element={<PrivateRoute allowedRoles={['admin']}><ManageProviders /></PrivateRoute>} />
            <Route path="/admin/jobs" element={<PrivateRoute allowedRoles={['admin']}><ManageJobs /></PrivateRoute>} />
            <Route path="/admin/reviews" element={<PrivateRoute allowedRoles={['admin']}><ManageReviews /></PrivateRoute>} />
            <Route path="/admin/settings" element={<PrivateRoute allowedRoles={['admin']}><SiteSettings /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
      <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'Inter, sans-serif' } }} />
    </BrowserRouter>
  );
};

export default App;
