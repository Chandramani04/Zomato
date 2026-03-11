import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PublicRoute = ({ children }) => {
    const { authData, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Reusable spinner can go here
    }

    if (authData.isAuthenticated) {
        if (authData.role === 'partner') {
            return <Navigate to={`/food-partner/${authData.id}`} replace />;
        }
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;
