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

    const isAuthenticated = useMemo(() => !!currentUser, [currentUser]);

    useEffect(() => {
        const token = CookieUtil.getCookie(COOKIE_KEYS.AUTH_TOKEN);
        if (token) {
            getUserProfile().then(res => setCurrentUser(res));
        }
    }, []);

    const login = (idToken: string) => {
        CookieUtil.setCookie(COOKIE_KEYS.AUTH_TOKEN, idToken, 1);
        getUserProfile().then(res => setCurrentUser(res));
    }

    const logout = () => {
        CookieUtil.deleteCookie(COOKIE_KEYS.AUTH_TOKEN);
        setCurrentUser(null);
    }

    const contextValue = useMemo(() => ({
        currentUser,
        setCurrentUser,
        isAuthenticated,
        login,
        logout,
    }), [currentUser, isAuthenticated]);

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <AuthContext.Provider value={contextValue}>
                {children}
            </AuthContext.Provider>
        </GoogleOAuthProvider>
    );
};


