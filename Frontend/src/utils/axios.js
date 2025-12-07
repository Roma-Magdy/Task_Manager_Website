import axios from 'axios';
import { toast } from 'sonner';

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Validate token contains only ASCII characters for HTTP header
        if (!/^[\x00-\x7F]*$/.test(token)) {
          console.error('Invalid token format detected');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(new Error('Invalid token format'));
        }
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Error setting authorization header:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Show user-friendly message
      toast.error('Session expired. Please login again.');
      
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
