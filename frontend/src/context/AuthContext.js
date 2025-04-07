import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = () => {
      const user = authService.getCurrentUser();
      if (user && authService.isAuthenticated()) {
        setCurrentUser(user);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.register(userData);
      setCurrentUser(user);
      return user;
    } catch (err) {
      const errorMessage = 
        typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.title || err.response?.data?.message || 'Registration failed';
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.login(credentials);
      setCurrentUser(user);
      return user;
    } catch (err) {
      const errorMessage = 
        typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.title || err.response?.data?.message || 'Login failed';
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: authService.isAuthenticated,
    isAdmin: authService.isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
