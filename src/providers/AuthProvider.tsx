import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from "../models/user.ts";

interface AuthContextValue {
    user: User | null;
    idToken: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
    login: (user: User, idToken: string) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

// Constants
const STORAGE_KEYS = {
  USER_INFO: 'google_user_info',
  ID_TOKEN: 'google_id_token',
} as const;

// Context
const AuthContext = createContext<AuthContextValue>({
    user: null,
    idToken: null,
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
  const [idToken, setIdToken] = useState<string | null>(null);
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
        const storedIdToken = sessionStorage.getItem(STORAGE_KEYS.ID_TOKEN);

        if (storedUserJSON && storedIdToken) {
          const parsedUser = JSON.parse(storedUserJSON) as User;
          setUser(parsedUser);
          setIdToken(storedIdToken);
        } else {
          // Clear invalid data
          sessionStorage.removeItem(STORAGE_KEYS.USER_INFO);
          sessionStorage.removeItem(STORAGE_KEYS.ID_TOKEN);
        }
      } catch (error) {
        setError('Failed to initialize authentication');
        // Clear corrupted data
        sessionStorage.removeItem(STORAGE_KEYS.USER_INFO);
        sessionStorage.removeItem(STORAGE_KEYS.ID_TOKEN);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
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

      // Store in sessionStorage
      sessionStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(nextUser));
      sessionStorage.setItem(STORAGE_KEYS.ID_TOKEN, nextIdToken);

      // Set authentication cookie for API calls
      const cookieExpiry = new Date();
      cookieExpiry.setTime(cookieExpiry.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
      document.cookie = `auth_token=${nextIdToken}; expires=${cookieExpiry.toUTCString()}; path=/; SameSite=Lax`;
      document.cookie = `user_id=${nextUser.id}; expires=${cookieExpiry.toUTCString()}; path=/; SameSite=Lax`;
      
      // Update state
      setUser(nextUser);
      setIdToken(nextIdToken);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
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
      sessionStorage.removeItem(STORAGE_KEYS.ID_TOKEN);

      // Clear authentication cookies
      document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Update state
      setUser(null);
      setIdToken(null);
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
      idToken,
      isLoading,
      isAuthenticated,
      error,
      login,
      logout,
      clearError,
    }),
    [user, idToken, isLoading, isAuthenticated, error, login, logout, clearError]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};


