import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import SEO from '../../components/SEO.jsx';
import { api } from '../../api/client.js';

export default function AdminLeads() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/leads');
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const mark = async (lead, read) => {
    try {
      await api.patch(`/leads/${lead._id}`, { read });
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const remove = async (lead) => {
    if (!confirm('Delete lead?')) return;
    try {
      await api.delete(`/leads/${lead._id}`);
      toast.success('Deleted');
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <SEO title="Leads" />
      <h1 className="heading-dlf font-display text-2xl font-semibold">Leads</h1>
      {loading ? (
        <p className="mt-6">Loading…</p>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((l) => (
            <div
              key={l._id}
              className={`rounded-2xl border p-4 dark:border-neutral-800 ${
                l.read ? 'border-neutral-200 bg-white dark:bg-neutral-900' : 'border-gold/40 bg-gold/5'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">{l.name}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {l.email} · {l.phone}
                  </p>
                  {l.source === 'navbar-book-call' ? (
                    <p className="mt-1 text-xs font-semibold heading-dlf text-gold">Book a call</p>
                  ) : null}
                  {l.propertyTitle && (
                    <p className="mt-1 text-sm">
                      Interested in:{' '}
                      {l.property?.slug ? (
                        <Link to={`/projects/${l.property.slug}`} className="text-gold hover:underline">
                          {l.propertyTitle}
                        </Link>
                      ) : (
                        l.propertyTitle
                      )}
                    </p>
                  )}
                  {l.message && <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">{l.message}</p>}
                  <p className="mt-2 text-xs text-neutral-400">{l.createdAt ? new Date(l.createdAt).toLocaleString() : ''}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-neutral-300 px-3 py-1 text-xs dark:border-neutral-600"
                    onClick={() => mark(l, !l.read)}
                  >
                    Mark {l.read ? 'unread' : 'read'}
                  </button>
                  <button type="button" className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-600" onClick={() => remove(l)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!items.length && <p className="text-sm text-neutral-500">No leads yet.</p>}
        </div>
      )}
    </>
  );
}
