import axios from 'axios';
import { ENV_CONFIG } from '../config/environment';

const API_URL = ENV_CONFIG.API_BASE_URL;

// Function to get ID token from sessionStorage
const getIdToken = (): string | null => {
  return sessionStorage.getItem('google_id_token');
};

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: ENV_CONFIG.CORS_CREDENTIALS, // Enable sending cookies for authentication
  timeout: ENV_CONFIG.API_TIMEOUT, // 10 second timeout
});

// Add request interceptor for authentication and logging
apiClient.interceptors.request.use(
  (config) => {
    // Add Authorization header if ID token is available
    const idToken = getIdToken();
    if (idToken) {
      config.headers.Authorization = `Bearer ${idToken}`;
    }
    
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden - show error message
      console.error('Access forbidden. Please check your permissions.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;