import axios from 'axios';

// Function to get ID token from sessionStorage
const getIdToken = (): string | null => {
  return sessionStorage.getItem('google_id_token');
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies for authentication
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for authentication and logging
axiosInstance.interceptors.request.use(
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
axiosInstance.interceptors.response.use(
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

export default axiosInstance;