import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { STORAGE_COMPARE } from '../utils/constants.js';

const MAX = 3;

const CompareContext = createContext(null);

function readIds() {
  try {
    const raw = localStorage.getItem(STORAGE_COMPARE);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((id) => typeof id === 'string').slice(0, MAX) : [];
  } catch {
    return [];
  }
}

export function CompareProvider({ children }) {
  const [ids, setIds] = useState(readIds);

  const toggleCompare = useCallback((id) => {
    setIds((prev) => {
      let next = [...prev];
      const i = next.indexOf(id);
      if (i >= 0) next.splice(i, 1);
      else {
        next.push(id);
        if (next.length > MAX) next = next.slice(-MAX);
      }
      localStorage.setItem(STORAGE_COMPARE, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => {
    localStorage.setItem(STORAGE_COMPARE, JSON.stringify([]));
    setIds([]);
  }, []);

  const value = useMemo(
    () => ({ ids, toggleCompare, clearCompare, max: MAX }),
    [ids, toggleCompare, clearCompare]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
