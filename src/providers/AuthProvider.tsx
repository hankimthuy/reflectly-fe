import {type ReactNode, useEffect} from 'react';
import {createContext, useContext, useMemo, useState} from 'react';
import type {User} from "../models/user.ts";
import {getUserProfile} from '../services/userService.ts';
import {GoogleOAuthProvider} from "@react-oauth/google";
import {COOKIE_KEYS} from "../constants/storage.ts";
import CookieUtil from "../utils/cookieUtil.ts";

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

    const isAuthenticated = useMemo(() => !!currentUser, [currentUser]);

    // Check for existing token and load profile data
    useEffect(() => {
        const initializeAuth = async () => {
            const token = CookieUtil.getCookie(COOKIE_KEYS.AUTH_TOKEN);
            
            if (token) {
                // User is authenticated by token, allow access immediately
                // Try to load profile from cookie first
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
                } catch (error) {
                    console.error('Failed to load user profile:', error);
                    // Don't log out user on profile load failure, they're still authenticated
                }
            }
            
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (idToken: string) => {
        CookieUtil.setCookie(COOKIE_KEYS.AUTH_TOKEN, idToken, 1);
        
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
    }

    const contextValue = useMemo(() => ({
        currentUser,
        setCurrentUser,
        isAuthenticated,
        login,
        logout,
        isLoading,
    }), [currentUser, isAuthenticated, isLoading]);

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <AuthContext.Provider value={contextValue}>
                {children}
            </AuthContext.Provider>
        </GoogleOAuthProvider>
    );
};


