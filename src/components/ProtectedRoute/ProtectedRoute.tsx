import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from '../../providers/AuthProvider';
import Loading from '../Loading/Loading';

type ProtectedRouteProps = {
    children: React.ReactNode;
    redirectTo?: string;
}

const ProtectedRoute = ({children, redirectTo = '/login'}: ProtectedRouteProps) => {
    const {isAuthenticated, isLoading} = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <Loading message="Checking authentication..." fullHeight/>;
    }

    // Redirect to log in if not authenticated, preserving the current path
    if (!isAuthenticated) {
        return <Navigate to={redirectTo} state={{from: location.pathname}} replace/>;
    }

    return children;
};

export default ProtectedRoute;
