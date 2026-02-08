import { GoogleOAuthProvider } from "@react-oauth/google";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { COOKIE_KEYS } from "../constants/storage.ts";
import type { User } from "../models/user.ts";
import { setAuthInitializing } from '../services/axiosSetup.ts';
import CookieUtil from "../utils/cookieUtil.ts";
import { getUserProfile } from "../services/userService.ts";

interface AuthContextValue {
    currentUser: User | null;
    isAuthenticated: boolean;
    login: (idToken: string) => void;
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

/** Cache key for the user profile query */
const USER_PROFILE_QUERY_KEY = ['userProfile'] as const;

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const queryClient = useQueryClient();
    const [token, setToken] = useState<string | null>(() =>
        CookieUtil.getCookie(COOKIE_KEYS.AUTH_TOKEN) || null
    );

    const isAuthenticated = useMemo(() => !!token, [token]);

    // Suppress 401 interceptor redirects while the initial profile query runs
    useEffect(() => {
        if (token) {
            setAuthInitializing(true);
        }
    }, []); // only on mount

    // Try to hydrate cached profile from cookie as initialData
    const cachedProfile = useMemo<User | undefined>(() => {
        const stored = CookieUtil.getCookie(COOKIE_KEYS.USER_PROFILE);
        if (stored) {
            try { return JSON.parse(stored) as User; } catch { /* ignore */ }
        }
        return undefined;
    }, []);

    const {
        data: currentUser = null,
        isLoading: isProfileLoading,
        isFetched,
    } = useQuery<User | null>({
        queryKey: USER_PROFILE_QUERY_KEY,
        queryFn: async () => {
            const profile = await getUserProfile();
            // Persist fresh profile to cookie
            CookieUtil.setCookie(COOKIE_KEYS.USER_PROFILE, JSON.stringify(profile), 1);
            return profile;
        },
        enabled: !!token,
        initialData: cachedProfile ?? undefined,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error) => {
            const status = (error as { response?: { status?: number } })?.response?.status;
            // Don't retry on 401 — token is invalid
            if (status === 401) return false;
            return failureCount < 2;
        },
    });

    // After the profile query settles, release the interceptor guard
    useEffect(() => {
        if (!token || isFetched) {
            setAuthInitializing(false);
        }
    }, [token, isFetched]);

    // Handle 401 from profile query — clean up invalid token
    const profileQueryState = queryClient.getQueryState(USER_PROFILE_QUERY_KEY);
    useEffect(() => {
        if (profileQueryState?.status === 'error') {
            const error = profileQueryState.error as { response?: { status?: number } };
            if (error?.response?.status === 401) {
                CookieUtil.deleteCookie(COOKIE_KEYS.AUTH_TOKEN);
                CookieUtil.deleteCookie(COOKIE_KEYS.USER_PROFILE);
                setToken(null);
            }
        }
    }, [profileQueryState?.status, profileQueryState?.error, queryClient]);

    // isLoading = true only while we're still determining auth state
    // Fixed logic: Don't show loading if we have cached profile, even if token exists
    const isLoading = !!token && isProfileLoading && !cachedProfile;

    const login = useCallback(async (idToken: string) => {
        console.log('AuthProvider: Login called, setting token and profile');
        CookieUtil.setCookie(COOKIE_KEYS.AUTH_TOKEN, idToken, 1);
        setToken(idToken);
        // Refetch profile with the new token
        await queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
        console.log('AuthProvider: Login completed, token set and profile invalidated');
    }, [queryClient]);

    const logout = useCallback(() => {
        CookieUtil.deleteCookie(COOKIE_KEYS.AUTH_TOKEN);
        CookieUtil.deleteCookie(COOKIE_KEYS.USER_PROFILE);
        setToken(null);
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


