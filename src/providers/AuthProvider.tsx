import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from "../models/user.ts";
import CookieService from '../services/auth/cookieService';
import { getUserProfile } from '../services/auth/authService';

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
    login: (user: User, idToken: string) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

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

export const AuthProvider = ({ children }: {children: ReactNode;}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = useMemo(() => !!user, [user]);

  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      try {
        setIsLoading(true);
        
        const token = CookieService.getToken();
        
        if (token) {
          const userData = await getUserProfile();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to initialize authentication:', error);
        CookieService.removeToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const authCheckInterval = setInterval(() => {
      const token = CookieService.getToken();
      
      setUser(currentUser => {
        if (!token && currentUser) {
          return null;
        }
        return currentUser;
      });
    }, 1000);

    return () => clearInterval(authCheckInterval);
  }, []);

  const login = useCallback(async (nextUser: User, nextIdToken: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!nextUser || !nextIdToken) {
        throw new Error('Invalid user data or token');
      }

      if (!nextUser.id || !nextUser.email || !nextUser.fullName || nextUser.pictureUrl === undefined) {
        throw new Error('Invalid user data structure');
      }

      CookieService.setToken(nextIdToken);
      
      setUser(nextUser);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
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

      CookieService.removeToken();
      
      setUser(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

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


