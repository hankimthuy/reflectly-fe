import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

interface LocationState {
  from?: {
    pathname: string;
  };
}

/**
 * Custom hook to handle authentication redirects
 * Redirects authenticated users away from login page
 * Redirects unauthenticated users to login page
 */
export const useAuthRedirect = (requireAuth: boolean = true): void => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    const state = location.state as LocationState;
    const from = state?.from?.pathname || '/';

    if (requireAuth && !isAuthenticated) {
      // Redirect to login if authentication is required but user is not authenticated
      navigate('/login', { 
        state: { from: location.pathname },
        replace: true 
      });
    } else if (!requireAuth && isAuthenticated) {
      // Redirect away from login page if user is already authenticated
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location, requireAuth]);
};

/**
 * Hook for login page - redirects authenticated users away
 */
export const useLoginRedirect = (): void => {
  useAuthRedirect(false);
};

/**
 * Hook for protected pages - redirects unauthenticated users to login
 */
export const useProtectedRoute = (): void => {
  useAuthRedirect(true);
};
