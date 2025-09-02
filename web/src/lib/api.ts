import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:3000' : '/api',
  withCredentials: true,
});

// Request interceptor for token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for 401
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    
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

// Health check function to verify backend connectivity
export const checkBackendHealth = async () => {
  try {
    console.log('Attempting health check to:', `${api.defaults.baseURL}/health`);
    const response = await api.get('/health');
    console.log('Backend health check successful:', response.data);
    return true;
  } catch (error) {
    console.error('Backend health check failed:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      baseURL: api.defaults.baseURL
    });
    
    // Try the root endpoint as a fallback
    try {
      console.log('Attempting fallback health check to:', `${api.defaults.baseURL}/`);
      const fallbackResponse = await api.get('/');
      console.log('Fallback health check successful:', fallbackResponse.data);
      return true;
    } catch (fallbackError) {
      console.error('Fallback health check also failed:', fallbackError);
      return false;
    }
  }
};

export default api; 