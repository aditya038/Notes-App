import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios base
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
      withCredentials: true,
    });
    return instance;
  }, []);

  useEffect(() => {
    async function fetchMe() {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data?.id ? data : null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, [api]);

  function login() {
    const url = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api') + '/auth/google';
    window.location.href = url;
  }

  async function logout() {
    await api.post('/auth/logout');
    setUser(null);
  }

  const value = { user, setUser, loading, login, logout, api };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


