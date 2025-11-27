import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Base API URL from environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create the base axios instance for player API (no auth token)
const playerApiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create the admin axios instance with auth token
const adminApiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for admin API to add auth token
adminApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for admin API to handle errors globally
adminApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error cases for admin API
    if (error.response?.status === 401) {
      // Clear auth token and redirect to login
      localStorage.removeItem('accessToken');
      window.location.href = '/admin/login';
    }

    return Promise.reject(error);
  }
);

export { playerApiClient, adminApiClient };