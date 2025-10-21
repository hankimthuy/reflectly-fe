import axios from 'axios';

// Function to get ID token from sessionStorage
const getIdToken = (): string | null => {
  return sessionStorage.getItem('google_id_token');
};

// Function to get authentication cookie
const getAuthCookie = (): string | null => {
  // Try to get authentication cookie from document.cookie
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => 
    cookie.trim().startsWith('auth_token=') || 
    cookie.trim().startsWith('token=') ||
    cookie.trim().startsWith('session=')
  );
  return authCookie ? authCookie.split('=')[1] : null;
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
    const authCookie = getAuthCookie();
    
    if (idToken) {
      config.headers.Authorization = `Bearer ${idToken}`;
    }
    
    // Ensure cookies are sent with request
    config.withCredentials = true;
    
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`, { 
      hasToken: !!idToken, 
      hasCookie: !!authCookie 
    });
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
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      console.log('🔐 401 Unauthorized - redirecting to /login');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden - show error message
      console.error('❌ Access forbidden. Please check your permissions.');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;