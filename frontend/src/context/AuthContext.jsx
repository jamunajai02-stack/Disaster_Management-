import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

const TOKEN_KEY = 'sdrp_token';
const USER_KEY = 'sdrp_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const persistSession = useCallback((token, userData) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) setUser(JSON.parse(stored));
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await authService.login(email, password);
    if (data.success) {
      persistSession(data.token, data.user);
    }
    return data;
  };

  const register = async (payload) => {
    const { data } = await authService.register(payload);
    if (data.success) {
      persistSession(data.token, data.user);
    }
    return data;
  };

  const logout = () => clearSession();

  const updateUser = (userData) => {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ADMIN',
      login,
      register,
      logout,
      updateUser,
    }),
    [user, loading, persistSession, clearSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
