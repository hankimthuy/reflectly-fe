import { useState, useCallback } from 'react';
import { type CredentialResponse } from "@react-oauth/google";
import { loginWithGoogleIdToken } from '../services/auth/authService';
import { useAuth } from '../providers/AuthProvider';

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
export const useGoogleAuth = (): UseGoogleAuthReturn => {
  const { login, clearError: clearAuthError } = useAuth();
  
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
      // Navigation will be handled by LoginPage useEffect when isAuthenticated changes
      await login(backendResponse.user, idToken);

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Login failed during backend authentication step.';
      
      setError(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  }, [login, clearAuthError]);

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
