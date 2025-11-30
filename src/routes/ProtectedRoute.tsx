import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from '../providers/AuthProvider';

type ProtectedRouteProps = {
    children: React.ReactNode;
    redirectTo?: string;
}

const ProtectedRoute = ({children, redirectTo = '/login'}: ProtectedRouteProps) => {
    const {isAuthenticated} = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} state={{from: location.pathname}} replace/>;
    }

    return children;
};

export default ProtectedRoute;

