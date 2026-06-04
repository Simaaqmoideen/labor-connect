import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('labor_connect_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('labor_connect_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  sendOTP: (phone) => api.post('/auth/otp/send', { phone }),
  verifyOTPRegister: (data) => api.post('/auth/otp/verify-register', data),
  verifyOTPLogin: (data) => api.post('/auth/otp/verify-login', data),
  getMe: () => api.get('/auth/me')
};

export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
  getWorkers: (params) => api.get('/admin/workers', { params }),
  updateWorkerStatus: (id, status) => api.patch(`/admin/workers/${id}/status`, { status }),
  deleteWorker: (id) => api.delete(`/admin/workers/${id}`),
  getProviders: (params) => api.get('/admin/providers', { params }),
  getProviderLocations: () => api.get('/admin/providers/locations'),
  updateProviderStatus: (id, status) => api.patch(`/admin/providers/${id}/status`, { status }),
  deleteProvider: (id) => api.delete(`/admin/providers/${id}`),
  getJobs: (params) => api.get('/admin/jobs', { params }),
  updateJob: (id, data) => api.patch(`/admin/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
  getReviews: (params) => api.get('/admin/reviews', { params }),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.patch('/admin/settings', data),
};

export const providerAPI = {
  searchWorkers: (params) => api.get('/provider/workers/search', { params }),
  getWorkerProfile: (id) => api.get(`/provider/workers/${id}`),
  postJob: (data) => api.post('/provider/jobs', data),
  sendJobToMultiple: (data) => api.post('/provider/jobs/multiple', data),
  getMyJobs: (params) => api.get('/provider/jobs', { params }),
  updateJobStatus: (id, status) => api.patch(`/provider/jobs/${id}/status`, { status }),
  rateWorker: (jobId, data) => api.post(`/provider/jobs/${jobId}/rate`, data),
  getProviderProfile: () => api.get('/provider/profile'),
  updateProviderProfile: (data) => api.patch('/provider/profile', data),
  updateProviderLocation: (lat, lng) => api.patch('/provider/location', { lat, lng }),
  getChatHistory: (recipientId) => api.get(`/chat/history/${recipientId}`),
};

export const workerAPI = {
  getProfile: () => api.get('/worker/profile'),
  updateProfile: (data) => api.patch('/worker/profile', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
  }),
  updateAvailability: (availability) => api.patch('/worker/availability', { availability }),
  updateLocation: (data) => api.patch('/worker/location', data),
  getIncomingRequests: () => api.get('/worker/jobs/incoming'),
  getJobRequest: (jobId) => api.get(`/worker/jobs/${jobId}/request`),
  acceptJob: (jobId) => api.patch(`/worker/jobs/${jobId}/accept`),
  rejectJob: (jobId) => api.patch(`/worker/jobs/${jobId}/reject`),
  respondToJob: (id, status) => api.patch(`/worker/jobs/${id}/respond`, { status }),
  getMyJobs: (params) => api.get('/worker/jobs', { params }),
  getEarnings: () => api.get('/worker/earnings'),
  getMyRatings: () => api.get('/worker/ratings'),
  uploadPhoto: (formData) => api.post('/worker/upload-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getJobProviders: () => api.get('/worker/providers'),
  getChatHistory: (recipientId) => api.get(`/chat/history/${recipientId}`),
};

export const chatAPI = {
  getHistory: (jobId) => api.get(`/chat/history/${jobId}`),
  sendMessage: (jobId, message) => api.post(`/chat/send/${jobId}`, { message })
};

export const locationAPI = {
  update: (data) => api.put('/location/update', data),
  get: (userId, role) => api.get(`/location/${userId}?role=${role}`),
  updateWorksite: (jobId, data) => api.put(`/location/worksite/${jobId}`, data)
};

export const jobsAPI = {
  getDetails: (id) => api.get(`/jobs/${id}`)
};

export default api;
