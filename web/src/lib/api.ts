import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '/api',
  withCredentials: true,
});

// Request interceptor for token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Only redirect if the user is on /dashboard
      if (window.location.pathname === '/dashboard') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api; 