import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from '../providers/AuthProvider';
import CookieUtil from '../utils/cookieUtil.ts';
import {COOKIE_KEYS} from '../constants/storage.ts';

type ProtectedRouteProps = {
    children: React.ReactNode;
    redirectTo?: string;
}

const ProtectedRoute = ({children, redirectTo = '/login'}: ProtectedRouteProps) => {
    const {isLoading} = useAuth();
    const location = useLocation();

    // Check if user has a valid token - that's enough for access
    const hasToken = CookieUtil.getCookie(COOKIE_KEYS.AUTH_TOKEN);

    // Show loading spinner only while checking for token on initial load
    if (isLoading && !hasToken) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px'
            }}>
                Loading...
            </div>
        );
    }

    if (!hasToken) {
        return <Navigate to={redirectTo} state={{from: location.pathname}} replace/>;
    }

    return children;
};

export default ProtectedRoute;

