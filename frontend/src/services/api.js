import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Authorization header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('autosmart_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired/invalid
      if (localStorage.getItem('autosmart_token')) {
        console.warn('Session expired or unauthorized token.');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
