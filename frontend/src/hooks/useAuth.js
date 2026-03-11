import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuth = () => {
    const [authData, setAuthData] = useState({
        isAuthenticated: false,
        role: null, // 'user', 'partner', or null
        id: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/auth/me', {
                    withCredentials: true
                });
                if (response.status === 200 && response.data.role) {
                    setAuthData({
                        isAuthenticated: true,
                        role: response.data.role,
                        id: response.data.id
                    });
                } else {
                    setAuthData({
                        isAuthenticated: false,
                        role: null,
                        id: null
                    });
                }
            } catch (error) {
                console.error("Auth status check failed:", error);
                setAuthData({
                    isAuthenticated: false,
                    role: null,
                    id: null
                });
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const logout = async () => {
        try {
            const endpoint = authData.role === 'partner' 
                ? 'http://localhost:3000/api/auth/foodpartner/logout'
                : 'http://localhost:3000/api/auth/user/logout';
            
            await axios.get(endpoint, {
                withCredentials: true
            });
            
            setAuthData({
                isAuthenticated: false,
                role: null,
                id: null
            });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return { authData, loading, setAuthData, logout };
};

export default useAuth;
