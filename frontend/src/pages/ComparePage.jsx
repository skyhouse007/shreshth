import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import { useCompare } from '../context/CompareContext.jsx';
import { api } from '../api/client.js';
import { formatPrice } from '../utils/constants.js';

export default function ComparePage() {
  const { ids, clearCompare } = useCompare();
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

  const fields = [
    { key: 'price', label: 'Price', render: (p) => formatPrice(p.price, p.purpose) },
    { key: 'type', label: 'Type', render: (p) => p.type },
    { key: 'purpose', label: 'Purpose', render: (p) => (p.purpose === 'rent' ? 'Rent' : 'Sale') },
    { key: 'bedrooms', label: 'Bedrooms', render: (p) => (p.type === 'plot' ? '—' : p.bedrooms) },
    { key: 'bathrooms', label: 'Bathrooms', render: (p) => (p.type === 'plot' ? '—' : p.bathrooms) },
    { key: 'area', label: 'Area (sqft)', render: (p) => p.area?.toLocaleString('en-IN') },
    { key: 'city', label: 'City', render: (p) => p.city },
  ];

  return (
    <>
      <SEO title="Compare projects" />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="heading-dlf font-display text-3xl font-semibold text-neutral-900 dark:text-white">Compare</h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Side-by-side for up to three listings.</p>
          </div>
          {ids.length > 0 && (
            <button
              type="button"
              onClick={clearCompare}
              className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
            >
              Clear all
            </button>
          )}
        </div>

        {!ids.length ? (
          <p className="mt-10 text-neutral-600 dark:text-neutral-400">
            No projects selected. Use the scale icon on a listing card to add items, then return here.
          </p>
        ) : loading ? (
          <p className="mt-10">Loading…</p>
        ) : (
          <div className="mt-10 overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-neutral-200 bg-neutral-50 p-4 text-left font-semibold dark:border-neutral-800 dark:bg-neutral-900">
                    Detail
                  </th>
                  {items.map((p) => (
                    <th
                      key={p._id}
                      className="border border-neutral-200 bg-neutral-50 p-4 text-left align-top dark:border-neutral-800 dark:bg-neutral-900"
                    >
                      <div className="max-w-[200px]">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt="" className="mb-2 h-28 w-full rounded-lg object-cover" loading="lazy" />
                        ) : null}
                        <Link to={`/projects/${p.slug}`} className="heading-dlf font-display text-base font-semibold text-gold hover:underline">
                          {p.title}
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fields.map((row) => (
                  <tr key={row.key}>
                    <td className="border border-neutral-200 bg-neutral-50 px-4 py-3 font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
                      {row.label}
                    </td>
                    {items.map((p) => (
                      <td key={p._id} className="border border-neutral-200 px-4 py-3 dark:border-neutral-800">
                        {row.render(p)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
