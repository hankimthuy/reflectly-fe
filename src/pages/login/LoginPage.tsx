import React, { useEffect } from 'react';
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import Loading from '../../components/common/Loading/Loading';
import './LoginPage.scss';

interface LocationState {
  from?: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, isAuthenticated } = useAuth();
  
  const state = location.state as LocationState;
  const intendedDestination = state?.from || '/';
  
  const { 
    isLoggingIn, 
    error: googleError, 
    handleGoogleSuccess, 
    handleGoogleError, 
    clearError 
  } = useGoogleAuth({ intendedDestination });

  // Handle redirects for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      // If user came from a protected route, redirect back to that route
      // Otherwise redirect to home
      navigate(intendedDestination, { replace: true });
    }
  }, [isAuthenticated, navigate, intendedDestination]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Get the current error (from auth context or google auth hook)
  const currentError = error || googleError;

  // Show loading if auth is initializing
  if (isLoading) {
    return (
      <main className="main-content">
        <Loading message="Initializing..." fullHeight />
      </main>
    );
  }

  return (
    <main className="main-content">
      <div className="login-container">
        <div className="login-card">
          <p>Sign in to continue to your account</p>

          {/* Error Display */}
          {currentError && (
            <div className="error-message">
              {currentError}
            </div>
          )}

          <div className="google-button-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              width="100%"
            />
          </div>

          {/* Loading indicator */}
          {isLoggingIn && (
            <div className="loading-indicator">
              Signing you in...
            </div>
          )}

          <div className="terms-text">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;