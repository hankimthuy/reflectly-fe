import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from '../providers/AuthProvider';

type ProtectedRouteProps = {
    children: React.ReactNode;
    redirectTo?: string;
}

const ProtectedRoute = ({children, redirectTo = '/login'}: ProtectedRouteProps) => {
    const {isAuthenticated, isLoading} = useAuth();
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

    return children;
};

export default ProtectedRoute;

