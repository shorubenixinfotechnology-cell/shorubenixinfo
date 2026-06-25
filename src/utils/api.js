import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    
    // Check if it's an admin request or user request
    if (config.url.includes('/admin') || config.url.includes('/auth/admin')) {
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    } else {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
