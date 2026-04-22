import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginApi, registerApi, getMeApi } from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const userData = await getMeApi();
                    setUser(userData);
                } catch (error) {
                    console.error("Session expired or invalid token");
                    localStorage.removeItem('access_token');
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const data = await loginApi(email, password);
            localStorage.setItem('access_token', data.access_token);
            
            // Fetch User Profile
            const userData = await getMeApi();
            setUser(userData);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email, password) => {
        setIsLoading(true);
        try {
            await registerApi(email, password);
            // Auto login after register
            return await login(email, password);
        } catch (error) {
            setIsLoading(false);
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setUser(null);
    };

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
