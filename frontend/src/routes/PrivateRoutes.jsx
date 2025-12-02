import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const PrivateRoute = ({ children }) => {
    const { user, isAuthenticated, validateTokenAndLoadUser, loading } = useAuth();
    const [hasValidated, setHasValidated] = useState(false);

    useEffect(() => {
        // Only validate on first load if no user is set
        if (!user && !hasValidated) {
            setHasValidated(true);
            validateTokenAndLoadUser();
        } else if (user) {
            // If user is already set (from login), no need to validate
            setHasValidated(true);
        }
    }, [user, hasValidated, validateTokenAndLoadUser]);

    // Show loading only while we're actually validating
    if (loading) {
        return (
            <div className='min-h-screen flex flex-col items-center justify-center'>
                <div className='rounded-full animate-spin w-12 h-12 border-3 border-[#FD6F00]/70'></div>
                <div className="text-white text-lg">Checking authentication...</div>
            </div>
        );
    }

    // If we haven't validated yet and no user, show loading
    if (!hasValidated && !user) {
        return (
            <div className='min-h-screen flex flex-col items-center justify-center'>
                <div className='rounded-full animate-spin w-12 h-12 border-3 border-[#FD6F00]/70'></div>
                <div className="text-white text-lg">Checking authentication...</div>
            </div>
        );
    }

    // If validated and not authenticated, redirect to login
    if (hasValidated && !isAuthenticated) {
        return <Navigate to="/prashant/login" replace />;
    }

    // If authenticated, show protected content
    return children;
}

export default PrivateRoute;
