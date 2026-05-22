/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      setUser(parsed);
    }
    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    if (data.success) {
      localStorage.setItem('userInfo', JSON.stringify(data.data));
      setUser(data.data);
      return data.data;
    }
    throw new Error(data.message);
  };

  // Register
  const register = async (name, email, password) => {
    const { data } = await API.post('/auth/register', {
      name,
      email,
      password,
    });
    if (data.success) {
      localStorage.setItem('userInfo', JSON.stringify(data.data));
      setUser(data.data);
      return data.data;
    }
    throw new Error(data.message);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};
