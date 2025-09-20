import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

// Types
export interface AuthUser {
  id: string;
  email: string;
  pictureUrl: string;
  fullName: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (user: AuthUser, token: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export interface AuthContextValue extends AuthState, AuthActions {}

// Constants
const STORAGE_KEYS = {
  TOKEN: 'id_token',
  USER_INFO: 'google_user_info',
} as const;

// Default context value
const defaultAuthContextValue: AuthContextValue = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  login: async () => {},
  logout: async () => {},
  clearError: () => {},
};

// Context
const AuthContext = createContext<AuthContextValue>(defaultAuthContextValue);

// Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Custom hook for auth context
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Main Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Computed values
  const isAuthenticated = useMemo(() => !!user, [user]);

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = (): void => {
      try {
        setIsLoading(true);
        const storedUserJSON = sessionStorage.getItem(STORAGE_KEYS.USER_INFO);
        const storedToken = sessionStorage.getItem(STORAGE_KEYS.TOKEN);

        if (storedUserJSON && storedToken) {
          const parsedUser = JSON.parse(storedUserJSON) as AuthUser;
          setUser(parsedUser);
        } else {
          // Clear invalid data
          sessionStorage.removeItem(STORAGE_KEYS.USER_INFO);
          sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError('Failed to initialize authentication');
        // Clear corrupted data
        sessionStorage.removeItem(STORAGE_KEYS.USER_INFO);
        sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (nextUser: AuthUser, token: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate inputs
      if (!nextUser || !token) {
        throw new Error('Invalid user data or token');
      }

      // Validate user object structure
      if (!nextUser.id || !nextUser.email || !nextUser.fullName || nextUser.pictureUrl === undefined) {
        throw new Error('Invalid user data structure');
      }

      // Store in sessionStorage
      sessionStorage.setItem(STORAGE_KEYS.TOKEN, token);
      sessionStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(nextUser));

      // Update state
      setUser(nextUser);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Clear storage
      sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.USER_INFO);

      // Update state
      setUser(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setError(errorMessage);
      console.error('Logout error:', error);
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


