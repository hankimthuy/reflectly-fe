import axios from 'axios';
import CookieService from '../auth/cookieService';
import NavigationService from '../utils/navigationService';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies automatically
  timeout: 10000,
});

// Request interceptor - Cookie is sent automatically by browser
axiosInstance.interceptors.request.use(
  (config) => {
    // Ensure cookies are sent with request
    config.withCredentials = true;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle authentication errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear JWT cookie
      CookieService.removeToken();
      
      // Use NavigationService to redirect properly
      const currentPath = window.location.pathname;
      NavigationService.navigateToLogin(currentPath); // No page reload, proper SPA navigation
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;