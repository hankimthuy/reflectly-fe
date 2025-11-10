import { useState, useCallback } from 'react';
import { type CredentialResponse } from "@react-oauth/google";
import { useNavigate } from 'react-router-dom';
import { loginWithGoogleIdToken } from '../services/authService';
import { useAuth } from '../providers/AuthProvider';

interface UseGoogleAuthOptions {
  intendedDestination?: string;
}

interface UseGoogleAuthReturn {
  isLoggingIn: boolean;
  error: string | null;
  handleGoogleSuccess: (credentialResponse: CredentialResponse) => Promise<void>;
  handleGoogleError: () => void;
  clearError: () => void;
}

/**
 * Custom hook for handling Google authentication
 */
export const useGoogleAuth = (options?: UseGoogleAuthOptions): UseGoogleAuthReturn => {
  const navigate = useNavigate();
  const { login, clearError: clearAuthError } = useAuth();
  
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const intendedDestination = options?.intendedDestination || '/';

  const clearError = useCallback((): void => {
    setError(null);
    clearAuthError();
  }, [clearAuthError]);

  const handleGoogleSuccess = useCallback(async (credentialResponse: CredentialResponse): Promise<void> => {
    if (!credentialResponse.credential) {
      const errorMsg = 'Did not receive credential from Google.';
      setError(errorMsg);
      return;
    }

    const idToken = credentialResponse.credential;

    try {
      setIsLoggingIn(true);
      setError(null);
      clearAuthError();

      const backendResponse = await loginWithGoogleIdToken(idToken);
      
      // Use AuthContext to persist and update app state
      await login(backendResponse.user, idToken);
      
      // Navigate to intended destination after successful login
      navigate(intendedDestination, { replace: true });

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Login failed during backend authentication step.';
      
      setError(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  }, [login, navigate, clearAuthError, intendedDestination]);

  const handleGoogleError = useCallback((): void => {
    const errorMsg = 'Google authentication failed. Please try again.';
    setError(errorMsg);
  }, []);

  return {
    isLoggingIn,
    error,
    handleGoogleSuccess,
    handleGoogleError,
    clearError,
  };
};
