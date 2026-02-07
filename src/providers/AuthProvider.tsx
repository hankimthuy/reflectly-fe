import {type ReactNode, useEffect} from 'react';
import {createContext, useContext, useMemo, useState} from 'react';
import type {User} from "../models/user.ts";
import {getUserProfile} from '../services/userService.ts';
import {GoogleOAuthProvider} from "@react-oauth/google";
import {COOKIE_KEYS} from "../constants/storage.ts";
import CookieUtil from "../utils/cookieUtil.ts";
import {setAuthInitializing} from '../services/axiosSetup.ts';

interface AuthContextValue {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    isAuthenticated: boolean;
    login: (idToken: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);

    const isAuthenticated = useMemo(() => {
        const hasToken = !!CookieUtil.getCookie(COOKIE_KEYS.AUTH_TOKEN);
        return hasToken;
    }, [token]);

    // Check for existing token and load profile data
    useEffect(() => {
        const initializeAuth = async () => {
            // Suppress 401 redirects during initial auth check
            setAuthInitializing(true);
            
            const existingToken = CookieUtil.getCookie(COOKIE_KEYS.AUTH_TOKEN);
            
            if (existingToken) {
                // Sync token state so isAuthenticated becomes true immediately
                setToken(existingToken);
                
                // Try to load profile from cookie first for instant UI
                const storedProfile = CookieUtil.getCookie(COOKIE_KEYS.USER_PROFILE);
                if (storedProfile) {
                    try {
                        const user = JSON.parse(storedProfile);
                        setCurrentUser(user);
                    } catch (error) {
                        console.error('Failed to parse stored profile:', error);
                    }
                }
                
                // Load fresh profile data asynchronously
                try {
                    const profile = await getUserProfile();
                    setCurrentUser(profile);
                    // Store profile in cookie for future use
                    CookieUtil.setCookie(COOKIE_KEYS.USER_PROFILE, JSON.stringify(profile), 1);
                } catch (error: unknown) {
                    console.error('Failed to load user profile:', error);
                    // If 401, token is truly invalid — clean up
                    const axiosError = error as { response?: { status?: number } };
                    if (axiosError?.response?.status === 401) {
                        CookieUtil.deleteCookie(COOKIE_KEYS.AUTH_TOKEN);
                        CookieUtil.deleteCookie(COOKIE_KEYS.USER_PROFILE);
                        setCurrentUser(null);
                        setToken(null);
                    }
                    // For other errors (network, 500, etc.), keep user authenticated
                }
            }
            
            setIsLoading(false);
            setAuthInitializing(false);
        };

        initializeAuth();
    }, []);

    const login = async (idToken: string) => {
        CookieUtil.setCookie(COOKIE_KEYS.AUTH_TOKEN, idToken, 1);
        setToken(idToken); // Trigger re-render for isAuthenticated
        
        try {
            const profile = await getUserProfile();
            setCurrentUser(profile);
            // Store profile in cookie
            CookieUtil.setCookie(COOKIE_KEYS.USER_PROFILE, JSON.stringify(profile), 1);
        } catch (error) {
            console.error('Failed to load profile during login:', error);
            // Still consider user logged in even if profile fails
        }
    }

    const logout = () => {
        CookieUtil.deleteCookie(COOKIE_KEYS.AUTH_TOKEN);
        CookieUtil.deleteCookie(COOKIE_KEYS.USER_PROFILE);
        setCurrentUser(null);
        setToken(null); // Trigger re-render for isAuthenticated
    }

    const contextValue = useMemo(() => ({
        currentUser,
        setCurrentUser,
        isAuthenticated,
        login,
        logout,
        isLoading,
    }), [currentUser, isLoading, isAuthenticated]);

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <AuthContext.Provider value={contextValue}>
                {children}
            </AuthContext.Provider>
        </GoogleOAuthProvider>
    );
};


