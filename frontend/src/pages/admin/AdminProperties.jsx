import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../../components/SEO.jsx';
import { api } from '../../api/client.js';

export default function AdminProperties() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/properties', { params: { limit: 100 } });
      setItems(data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!confirm('Delete this property?')) return;
    try {
      await api.delete(`/properties/${id}`);
      toast.success('Deleted');
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <SEO title="Listings admin" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="heading-dlf font-display text-2xl font-semibold">Listings (inventory)</h1>
        <Link
          to="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy"
        >
          <Plus className="h-4 w-4" />
          Add property
        </Link>
      </div>
      {loading ? (
        <p className="mt-8">Loading…</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
              <tr>
                <th className="p-3 font-semibold">Title</th>
                <th className="p-3 font-semibold">City</th>
                <th className="p-3 font-semibold">Type</th>
                <th className="p-3 font-semibold">Purpose</th>
                <th className="p-3 font-semibold">Featured</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p._id} className="border-b border-neutral-100 dark:border-neutral-800">
                  <td className="p-3 font-medium">{p.title}</td>
                  <td className="p-3">{p.city}</td>
                  <td className="p-3 capitalize">{p.type}</td>
                  <td className="p-3 capitalize">{p.purpose}</td>
                  <td className="p-3">{p.featured ? 'Yes' : '—'}</td>
                  <td className="p-3 capitalize">{p.status}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/projects/${p._id}/edit`}
                        className="rounded-lg p-2 text-gold hover:bg-gold/10"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button type="button" className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40" onClick={() => remove(p._id)}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
