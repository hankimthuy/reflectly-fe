import axios from 'axios';
import CookieService from '../auth/cookieService';
import NavigationService from '../utils/navigationService';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

let isRedirecting = false;
const REDIRECT_DEBOUNCE_MS = 2000;

const handleUnauthorizedError = (): void => {
  if (isRedirecting) {
    return;
  }

  isRedirecting = true;
  CookieService.removeToken();

  const currentPath = window.location.pathname;
  NavigationService.navigateToLogin(currentPath);

  setTimeout(() => {
    isRedirecting = false;
  }, REDIRECT_DEBOUNCE_MS);
};

axiosInstance.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      handleUnauthorizedError();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;