import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import SEO from '../../components/SEO.jsx';
import { api } from '../../api/client.js';

export default function AdminMessages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/contact');
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

  const mark = async (msg, read) => {
    try {
      await api.patch(`/contact/${msg._id}`, { read });
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const remove = async (msg) => {
    if (!confirm('Delete message?')) return;
    try {
      await api.delete(`/contact/${msg._id}`);
      toast.success('Deleted');
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <SEO title="Messages" />
      <h1 className="heading-dlf font-display text-2xl font-semibold">Contact messages</h1>
      {loading ? (
        <p className="mt-6">Loading…</p>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((m) => (
            <div
              key={m._id}
              className={`rounded-2xl border p-4 dark:border-neutral-800 ${
                m.read ? 'border-neutral-200 bg-white dark:bg-neutral-900' : 'border-gold/40 bg-gold/5'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {m.email}
                    {m.phone ? ` · ${m.phone}` : ''}
                  </p>
                  <p className="mt-2 text-sm whitespace-pre-wrap">{m.message}</p>
                  <p className="mt-2 text-xs text-neutral-400">{m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-neutral-300 px-3 py-1 text-xs dark:border-neutral-600"
                    onClick={() => mark(m, !m.read)}
                  >
                    Mark {m.read ? 'unread' : 'read'}
                  </button>
                  <button type="button" className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-600" onClick={() => remove(m)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!items.length && <p className="text-sm text-neutral-500">No messages.</p>}
        </div>
      )}
    </>
  );
}
