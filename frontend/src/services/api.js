import axios from 'axios';

// Create Axios instance with base URL pointing to the Spring Boot REST API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred. Please check if the server is running.';
    if (error.response) {
      if (error.response.status === 401) {
        message = error.response.data?.message || 'Invalid credentials or session expired.';
      } else if (error.response.status === 403) {
        message = 'Access denied: You do not have permission to view or perform this action.';
      } else if (error.response.data && error.response.data.message) {
        message = error.response.data.message;
      } else if (error.response.status === 404) {
        message = 'Requested record not found.';
      } else if (error.response.status === 409) {
        message = 'Conflict: Record already exists.';
      } else if (error.response.status === 400) {
        message = 'Invalid data submitted.';
      }
    } else if (error.request) {
      message = 'Unable to connect to backend server at http://localhost:8080. Please ensure Spring Boot is running.';
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
