import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from '../providers/AuthProvider';
import {APP_ROUTES} from '../constants/route';

type ProtectedRouteProps = {
    children: React.ReactNode;
    redirectTo?: string;
    /** Set true only for the Onboarding route itself, to avoid redirecting to itself. */
    skipOnboardingGate?: boolean;
}

const ProtectedRoute = ({children, redirectTo = '/login', skipOnboardingGate = false}: ProtectedRouteProps) => {
    const {isAuthenticated, isLoading, currentUser} = useAuth();
    const location = useLocation();

    if (isLoading) {
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

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} state={{from: location.pathname}} replace/>;
    }

    if (!skipOnboardingGate && currentUser?.onboardingCompleted === false) {
        return <Navigate to={APP_ROUTES.ONBOARDING} replace/>;
    }

    return children;
};

export default ProtectedRoute;

