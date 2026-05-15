import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { STORAGE_FAVORITES } from '../utils/constants.js';

const FavoritesContext = createContext(null);

function readFav() {
  try {
    const raw = localStorage.getItem(STORAGE_FAVORITES);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [ids, setIds] = useState(readFav);

  const persist = useCallback((next) => {
    localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(next));
    setIds(next);
  }, []);

  const toggleFavorite = useCallback(
    (id) => {
      const set = new Set(ids);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      persist([...set]);
    },
    [ids, persist]
  );

  const isFavorite = useCallback((id) => ids.includes(id), [ids]);

  const value = useMemo(
    () => ({ ids, toggleFavorite, isFavorite }),
    [ids, toggleFavorite, isFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
