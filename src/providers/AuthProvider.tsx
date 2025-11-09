import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from "../models/user.ts";
import CookieService from '../services/auth/cookieService';

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
    login: (user: User, idToken: string) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

// Context
const AuthContext = createContext<AuthContextValue>({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
    login: async () => {},
    logout: async () => {},
    clearError: () => {},
});

// Custom hook for auth context
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Main Provider Component
export const AuthProvider = ({ children }: {children: ReactNode;}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Computed values
  const isAuthenticated = useMemo(() => !!user, [user]);

  // Initialize auth state - decode JWT from cookie
  useEffect(() => {
    const initializeAuth = (): void => {
      try {
        setIsLoading(true);
        
        // Decode user info directly from JWT in cookie
        const userFromToken = CookieService.getUserFromToken();
        
        if (userFromToken) {
          setUser(userFromToken);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to initialize authentication:', error);
        setError('Failed to initialize authentication');
        CookieService.removeToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Poll for authentication changes (token expiration or external logout)
    // Decode JWT each time to ensure user data is always in sync with token
    const authCheckInterval = setInterval(() => {
      const userFromToken = CookieService.getUserFromToken();
      
      // If token expired or removed, clear user state
      if (!userFromToken && user) {
        setUser(null);
      }
      // If token exists but user state is stale, update it
      else if (userFromToken && (!user || user.id !== userFromToken.id)) {
        setUser(userFromToken);
      }
    }, 1000); // Check every second

    return () => clearInterval(authCheckInterval);
  }, [user]);

  // Login function - Set cookie and decode user from JWT
  const login = useCallback(async (nextUser: User, nextIdToken: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate inputs
      if (!nextUser) {
        throw new Error('Invalid user data');
      }

      if (!nextIdToken) {
        throw new Error('Invalid ID token');
      }

      // Validate user object structure
      if (!nextUser.id || !nextUser.email || !nextUser.fullName || nextUser.pictureUrl === undefined) {
        throw new Error('Invalid user data structure');
      }

      // Set JWT token in cookie (backend reads this)
      CookieService.setToken(nextIdToken);

      // Decode user from JWT to ensure sync
      const userFromToken = CookieService.getUserFromToken();
      if (!userFromToken) {
        throw new Error('Failed to decode user from token');
      }
      
      // Update state with decoded user
      setUser(userFromToken);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      // Clean up on error
      CookieService.removeToken();
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function - Clear cookie and user state
  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Clear JWT cookie
      CookieService.removeToken();
      
      // Update state
      setUser(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear error function
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  // Memoized context value
  const contextValue = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      error,
      login,
      logout,
      clearError,
    }),
    [user, isLoading, isAuthenticated, error, login, logout, clearError]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};


