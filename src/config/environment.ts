// Environment configuration
export const ENV_CONFIG = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_URL || 
    (import.meta.env.DEV ? 'http://localhost:8080/api' : ''),
  
  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  
  // Environment
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
  
  // API Timeout
  API_TIMEOUT: 10000,
  
  // CORS Configuration
  CORS_CREDENTIALS: true,
} as const;

// Validate required environment variables
export const validateEnvironment = () => {
  const errors: string[] = [];
  
  if (!ENV_CONFIG.GOOGLE_CLIENT_ID) {
    errors.push('VITE_GOOGLE_CLIENT_ID is required');
  }
  
  if (!ENV_CONFIG.API_BASE_URL) {
    errors.push('VITE_API_URL is required');
  }
  
  if (errors.length > 0) {
    console.error('Environment validation failed:', errors);
    return false;
  }
  
  console.log('Environment configuration loaded:', {
    API_BASE_URL: ENV_CONFIG.API_BASE_URL,
    IS_PRODUCTION: ENV_CONFIG.IS_PRODUCTION,
    IS_DEVELOPMENT: ENV_CONFIG.IS_DEVELOPMENT,
  });
  
  return true;
};

export default ENV_CONFIG;