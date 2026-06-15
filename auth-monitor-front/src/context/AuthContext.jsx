import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('accessToken');

    if (username && token) {
      setUser({ username, role });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('accessToken', userData.accessToken);
    localStorage.setItem('refreshToken', userData.refreshToken);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('role', userData.role); // 🛠️ Backend-dən gələn real rolu yazırıq!
    
    setUser({ username: userData.username, role: userData.role });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};