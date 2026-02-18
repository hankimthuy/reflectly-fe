import { GoogleOAuthProvider } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { STORAGE_KEYS } from "../constants/storage.ts";
import type { User } from "../models/user.ts";
import { useLoginMutation, useCredentialLoginMutation, useSignupMutation, useUserProfileQuery, USER_PROFILE_QUERY_KEY } from "../queries/authQueryHook.ts";

interface AuthContextValue {
    currentUser: User | null;
    isAuthenticated: boolean;
    login: (idToken: string) => Promise<void>;
    loginWithCredentials: (username: string, password: string) => Promise<void>;
    signup: (fullName: string, username: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    setCurrentUser: (user: User) => void;
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
    const credentialLoginMutation = useCredentialLoginMutation();
    const signupMutation = useSignupMutation();

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

    const loginWithCredentialsFn = useCallback(async (username: string, password: string) => {
        const { user } = await credentialLoginMutation.mutateAsync({ username, password });
        setLoginUser(user);
    }, [credentialLoginMutation]);

    const signupFn = useCallback(async (fullName: string, username: string, password: string) => {
        const { user } = await signupMutation.mutateAsync({ fullName, username, password });
        setLoginUser(user);
    }, [signupMutation]);

    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        setLoginUser(null);
        queryClient.removeQueries({ queryKey: USER_PROFILE_QUERY_KEY });
    }, [queryClient]);

    const setCurrentUser = useCallback((user: User) => {
        setLoginUser(user);
    }, []);

    const contextValue = useMemo(() => ({
        currentUser,
        isAuthenticated,
        login,
        loginWithCredentials: loginWithCredentialsFn,
        signup: signupFn,
        logout,
        isLoading,
        setCurrentUser,
    }), [currentUser, isAuthenticated, login, loginWithCredentialsFn, signupFn, logout, isLoading, setCurrentUser]);

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <AuthContext.Provider value={contextValue}>
                {children}
            </AuthContext.Provider>
        </GoogleOAuthProvider>
    );
};
