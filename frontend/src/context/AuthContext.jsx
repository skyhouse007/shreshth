import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import { STORAGE_TOKEN, STORAGE_USER } from '../utils/constants.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN));
  const [bootstrapping, setBootstrapping] = useState(Boolean(localStorage.getItem(STORAGE_TOKEN)));

  const persist = useCallback((nextToken, nextUser) => {
    if (nextToken) localStorage.setItem(STORAGE_TOKEN, nextToken);
    else localStorage.removeItem(STORAGE_TOKEN);
    if (nextUser) localStorage.setItem(STORAGE_USER, JSON.stringify(nextUser));
    else localStorage.removeItem(STORAGE_USER);
    setToken(nextToken || null);
    setUser(nextUser || null);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const { data } = await api.post('/admin/login', { email, password });
      persist(data.token, { _id: data._id, name: data.name, email: data.email });
    },
    [persist]
  );

  const logout = useCallback(() => {
    persist(null, null);
  }, [persist]);

  useEffect(() => {
    if (!token) {
      setBootstrapping(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/admin/me');
        if (!cancelled) {
          setUser({ _id: data._id, name: data.name, email: data.email, phone: data.phone });
          localStorage.setItem(STORAGE_USER, JSON.stringify(data));
        }
      } catch {
        if (!cancelled) persist(null, null);
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, persist]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      bootstrapping,
      login,
      logout,
    }),
    [user, token, bootstrapping, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
