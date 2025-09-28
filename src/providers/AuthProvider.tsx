import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from "../models/user.ts";

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
    login: (user: User) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

// Constants
const STORAGE_KEYS = {
  USER_INFO: 'google_user_info',
} as const;

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

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = (): void => {
      try {
        setIsLoading(true);
        const storedUserJSON = sessionStorage.getItem(STORAGE_KEYS.USER_INFO);

        if (storedUserJSON) {
          const parsedUser = JSON.parse(storedUserJSON) as User;
          setUser(parsedUser);
        } else {
          // Clear invalid data
          sessionStorage.removeItem(STORAGE_KEYS.USER_INFO);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError('Failed to initialize authentication');
        // Clear corrupted data
        sessionStorage.removeItem(STORAGE_KEYS.USER_INFO);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (nextUser: User): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate inputs
      if (!nextUser) {
        throw new Error('Invalid user data');
      }

      // Validate user object structure
      if (!nextUser.id || !nextUser.email || !nextUser.fullName || nextUser.pictureUrl === undefined) {
        throw new Error('Invalid user data structure');
      }

      // Store in sessionStorage
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


