// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

 const login = async (email, password) => {
  try {
    const { data } = await axiosInstance.post('/api/auth/login', { email, password });
    setUser({ id: data.id, name: data.name, email: data.email, token: data.token });
    return data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || 'Login failed';
    throw new Error(msg);
  }
};


  const register = async (name, email, password) => {
    try {
      const { data } = await axiosInstance.post('/api/auth/register', { name, email, password });
      setUser({ id: data.id, name: data.name, email: data.email, token: data.token });
      return data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Register failed';
      throw new Error(msg);
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
