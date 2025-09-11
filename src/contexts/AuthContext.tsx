import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  picture: string;
  fullName: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
}

const defaultAuthContextValue: AuthContextValue = {
  user: null,
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextValue>(defaultAuthContextValue);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedUserJSON = sessionStorage.getItem('google_user_info');
    if (storedUserJSON) {
      try {
        const storedUser = JSON.parse(storedUserJSON) as AuthUser;
        setUser(storedUser);
      } catch {
        sessionStorage.removeItem('google_user_info');
      }
    }
  }, []);

  const login = useCallback((nextUser: AuthUser, token: string) => {
    // Persist
    localStorage.setItem('id_token', token);
    sessionStorage.setItem('google_user_info', JSON.stringify(nextUser));
    // Update state
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('id_token');
    sessionStorage.removeItem('google_user_info');
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}


