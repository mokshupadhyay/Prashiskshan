import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import { authService } from '../services/AuthService';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    authMethod: 'email' | 'phone' | 'google' | 'apple';
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = user !== null;

    // Load user data from encrypted storage on app start
    useEffect(() => {
        loadUserFromStorage();
    }, []);

    const loadUserFromStorage = async () => {
        try {
            setIsLoading(true);
            const userData = await EncryptedStorage.getItem('user_data');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            }
        } catch (error) {
            console.error('Error loading user from storage:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (userData: User) => {
        try {
            // Store user data in encrypted storage
            await EncryptedStorage.setItem('user_data', JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error('Error storing user data:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Revoke OAuth access if user was logged in via OAuth
            if (user?.authMethod === 'google' || user?.authMethod === 'apple') {
                await authService.revokeAccess();
            }

            // Sign out from auth services
            await authService.signOut();

            // Remove user data from local storage
            await EncryptedStorage.removeItem('user_data');
            setUser(null);
        } catch (error) {
            console.error('Error during logout:', error);
            throw error;
        }
    };

    const updateUser = async (updates: Partial<User>) => {
        if (!user) return;

        try {
            const updatedUser = { ...user, ...updates };
            await EncryptedStorage.setItem('user_data', JSON.stringify(updatedUser));
            setUser(updatedUser);
        } catch (error) {
            console.error('Error updating user data:', error);
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
