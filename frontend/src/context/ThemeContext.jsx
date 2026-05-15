import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { STORAGE_THEME } from '../utils/constants.js';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem(STORAGE_THEME);
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
  });

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem(STORAGE_THEME, dark ? 'dark' : 'light');
  }, [dark]);

  const toggle = useCallback(() => setDark((d) => !d), []);

  const value = useMemo(() => ({ dark, toggle, setDark }), [dark, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
