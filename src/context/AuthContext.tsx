import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi } from '../services/api';
import type { User } from '../types/api';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, name: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Auto-login on mount if token exists
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                try {
                    // Verify token is still valid
                    const response = await authApi.getCurrentUser();
                    if (response.user) {
                        setUser(response.user);
                    }
                } catch (error) {
                    // Token is invalid, clear storage
                    console.error('Auto-login failed:', error);
                    authApi.logout();
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await authApi.login({ email, password });
            if (response.user) {
                setUser(response.user);
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const signup = async (email: string, name: string, password: string) => {
        try {
            const registerResponse = await authApi.register({ email, name, password });
            // Auto-login after successful registration
            if (registerResponse.success) {
                await login(email, password);
            }
        } catch (error) {
            console.error('Signup failed:', error);
            throw error;
        }
    };

    const logout = () => {
        authApi.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
