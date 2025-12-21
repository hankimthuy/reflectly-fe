import { GoogleOAuthProvider } from "@react-oauth/google";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { COOKIE_KEYS } from "../constants/storage.ts";
import type { User } from "../models/user.ts";
import { getUserProfile } from '../services/userService.ts';
import CookieUtil from "../utils/cookieUtil.ts";

interface AuthContextValue {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    isAuthenticated: boolean;
    login: (idToken: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const queryClient = useQueryClient();

    const { data: currentUser = null } = useQuery({
        queryKey: ['userProfile'],
        queryFn: getUserProfile,
        retry: false,
        staleTime: Infinity,
        enabled: !!CookieUtil.getCookie(COOKIE_KEYS.AUTH_TOKEN),
    });

    const isAuthenticated = useMemo(() => !!currentUser, [currentUser]);

    const setCurrentUser = (user: User | null) => {
        queryClient.setQueryData(['userProfile'], user);
    };

    const login = async (idToken: string) => {
        CookieUtil.setCookie(COOKIE_KEYS.AUTH_TOKEN, idToken, 1);
        await queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    }

    const logout = () => {
        CookieUtil.deleteCookie(COOKIE_KEYS.AUTH_TOKEN);
        queryClient.setQueryData(['userProfile'], null);
    }

    const contextValue = useMemo(() => ({
        currentUser,
        setCurrentUser,
        isAuthenticated,
        login,
        logout,
    }), [currentUser, isAuthenticated, queryClient]);

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <AuthContext.Provider value={contextValue}>
                {children}
            </AuthContext.Provider>
        </GoogleOAuthProvider>
    );
};


