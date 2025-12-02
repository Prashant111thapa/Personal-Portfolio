import api from '../services/api';
import { useState, useContext, useEffect, createContext } from 'react'

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false); // Start as false, only show loading when actually validating

    const validateTokenAndLoadUser = async () => {
        setLoading(true);
        try {
            // Get current user info from the backend using HTTP-only cookie
            const response = await api.get('/auth/me');
            const userData = response.data.data?.user;
            
            if (userData) {
                setUser(userData);
                return true;
            } else {
                setUser(null);
                return false;
            }
        } catch(err) {
            // Only log if it's not a 401 (unauthorized) error
            if (err.response?.status !== 401) {
                console.log('Error validating session:', err.message);
            }
            setUser(null);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try{
            const response = await api.post('/auth/login', credentials);
            
            const { user } = response.data.data || {};

            if(!user) {
                return { success: false, error: "Malformed login response"}
            }
            
            setUser(user);
            return { success: true, user };

        } catch(err) {
            const msg = err?.response?.data?.message || "Invalid Credentials";
            return { success: false, error: msg };
        }
    }

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch(err) {
            console.log('Logout error:', err);
        } finally {
            setUser(null);
        }
    }

    const isAuthenticated = !!user;

    // Don't automatically validate on mount - only when explicitly needed
    // useEffect(() => {
    //     validateTokenAndLoadUser();
    // }, []);
    // }, []);

    // Only show loading when actively validating authentication
    if (loading) {
        return (
            <div className='min-h-screen flex flex-col items-center justify-center'>
                <div className='rounded-full animate-spin w-12 h-12 border-3 border-[#FD6F00]/70'></div>
                <div className="text-white text-lg">Loading...</div>
            </div>
        );
    }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, validateTokenAndLoadUser, loading }}>
        {children}
    </AuthContext.Provider>
  );
}