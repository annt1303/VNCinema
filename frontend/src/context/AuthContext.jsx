import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAccessToken, getAccessToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session: fetch user profile if token exists, or attempt a refresh
  const initializeAuth = async () => {
    try {
      const token = getAccessToken();
      if (token) {
        // Fetch profile
        const profile = await api.get('/api/auth/me');
        setUser(profile);
      } else {
        // No memory token, attempt silent refresh if refresh cookie is present
        const refreshData = await api.post('/api/auth/refresh');
        if (refreshData?.accessToken) {
          setAccessToken(refreshData.accessToken);
          setUser(refreshData.user);
        }
      }
    } catch (err) {
      console.warn('Initial session check failed:', err.message);
      // Clean up token if invalid
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();

    // Listen to expired auth events dispatched from the api helper
    const handleAuthExpired = () => {
      setUser(null);
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.post('/api/auth/login', { email, password });
      setAccessToken(data.accessToken);
      setUser(data.user);
      return data.user;
    } catch (err) {
      throw new Error(err.message || 'Đăng nhập thất bại');
    }
  };

  const register = async (userData) => {
    try {
      const user = await api.post('/api/auth/register', userData);
      return user;
    } catch (err) {
      throw new Error(err.message || 'Đăng ký thất bại');
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.warn('Logout request failed:', err.message);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const sendOtp = async (email) => {
    try {
      await api.post('/api/auth/otp/send', { email });
    } catch (err) {
      throw new Error(err.message || 'Gửi mã OTP thất bại');
    }
  };

  const verifyOtp = async (email, otpCode) => {
    try {
      await api.post('/api/auth/otp/verify', { email, otpCode });
    } catch (err) {
      throw new Error(err.message || 'Xác thực OTP thất bại');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    sendOtp,
    verifyOtp,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
