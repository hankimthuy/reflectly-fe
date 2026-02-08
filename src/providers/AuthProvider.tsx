import { GoogleOAuthProvider } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { STORAGE_KEYS } from "../constants/storage.ts";
import type { User } from "../models/user.ts";
import { useLoginMutation, useUserProfileQuery, USER_PROFILE_QUERY_KEY } from "../queries/authQueryHook.ts";

interface AuthContextValue {
    currentUser: User | null;
    isAuthenticated: boolean;
    login: (idToken: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
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

    // Check if we have a stored token on mount
    const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

    // Profile rehydration query — runs on page refresh when token exists in localStorage
    const {
        data: profileUser = null,
        isLoading: isProfileLoading,
    } = useUserProfileQuery(!!storedToken);

    // Login mutation — calls POST /api/auth/google via React Query
    const loginMutation = useLoginMutation();

    // Local state for user set immediately on login (before query refetch)
    const [loginUser, setLoginUser] = useState<User | null>(null);

    // Prefer loginUser (set immediately on login) over profileUser (from query)
    const currentUser = loginUser ?? profileUser;
    const isAuthenticated = !!currentUser;
    const isLoading = !!storedToken && isProfileLoading && !loginUser;

    const login = useCallback(async (googleIdToken: string) => {
        const { user } = await loginMutation.mutateAsync(googleIdToken);
        setLoginUser(user);
    }, [loginMutation]);

    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        setLoginUser(null);
        queryClient.removeQueries({ queryKey: USER_PROFILE_QUERY_KEY });
    }, [queryClient]);

    const contextValue = useMemo(() => ({
        currentUser,
        isAuthenticated,
        login,
        logout,
        isLoading,
    }), [currentUser, isAuthenticated, login, logout, isLoading]);

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <AuthContext.Provider value={contextValue}>
                {children}
            </AuthContext.Provider>
        </GoogleOAuthProvider>
    );
};
