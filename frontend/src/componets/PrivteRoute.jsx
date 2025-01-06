import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, adminRoute }) => {
    const [authInfo, setAuthInfo] = useState({ isAuthenticated: null, role: null });
    
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/auth/check', {
                    credentials: 'include',
                });
                
                const result = await response.json();
                setAuthInfo({ isAuthenticated: result.isAuthenticated, role: result.role });
               
            } catch (error) {
                console.error('Error checking authentication:', error);
                setAuthInfo({ isAuthenticated: false, role: null });
            }
        };

        checkAuth();
    }, []);

    // Show loading while checking auth
    if (authInfo.isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    // If not authenticated, redirect to login
    if (!authInfo.isAuthenticated) {
        return <Navigate to="/login" />;
    }
    // If this is an admin route, but the user is not an admin, redirect to the user dashboard
    if (adminRoute && authInfo.role !== 'admin') {
        return <Navigate to="/" />;
    }

    // Redirect to admin dashboard if role is admin and user is accessing a non-admin route
    if (!adminRoute && authInfo.role === 'admin') {
        return <Navigate to="/admin" />;
    }

    // If authenticated and the role matches, render the protected component
    return children;
};

export default PrivateRoute;
