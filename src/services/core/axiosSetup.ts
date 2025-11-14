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
let isRedirecting = false;

axiosInstance.interceptors.request.use(
  (config) => {
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
    if (error.response?.status === 401 && !isRedirecting) {
      isRedirecting = true;
      CookieService.removeToken();
      
      const currentPath = window.location.pathname;
      NavigationService.navigateToLogin(currentPath);
      
      setTimeout(() => {
        isRedirecting = false;
      }, 2000);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;