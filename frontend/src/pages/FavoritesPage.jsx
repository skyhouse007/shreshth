import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import PropertyCard from '../components/PropertyCard.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { api } from '../api/client.js';

export default function FavoritesPage() {
  const { ids } = useFavorites();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ids.length) {
      setItems([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/properties/by-ids', { params: { ids: ids.join(',') } });
        if (!cancelled) setItems(data);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ids]);

  return (
    <>
      <SEO title="Saved projects" />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
        <h1 className="heading-dlf font-display text-3xl font-semibold text-neutral-900 dark:text-white">Favorites</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Stored on this device only.</p>
        {!ids.length ? (
          <p className="mt-10 text-neutral-600 dark:text-neutral-400">
            No saved homes yet. Tap the heart on a card to build your wishlist.
          </p>
        ) : loading ? (
          <p className="mt-10">Loading…</p>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => (
              <PropertyCard key={p._id} property={p} index={i} />
            ))}
          </div>
        )}
        {ids.length > 0 && !loading && items.length === 0 && (
          <p className="mt-10">
            Saved IDs are stale.{' '}
            <Link to="/projects" className="text-gold hover:underline">
              Browse listings
            </Link>
          </p>
        )}
      </div>
    </>
  );
}
