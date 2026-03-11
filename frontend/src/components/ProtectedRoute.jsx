import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { authData, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Could be a reusable Spinner component later
    }

    if (!authData.isAuthenticated) {
        return <Navigate to="/register" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(authData.role)) {
        // If role is not allowed, decide where to redirect based on role
        if (authData.role === 'partner') {
            return <Navigate to={`/food-partner/${authData.id}`} replace />;
        }
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
