import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Pencil, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../../components/SEO.jsx';
import { api } from '../../api/client.js';

export default function AdminSiteProjects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/site-projects');
      setItems(data.items || []);
    } catch (e) {
      toast.error(e.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!confirm('Delete this portfolio project? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/site-projects/${id}`);
      toast.success('Deleted');
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <SEO title="Portfolio projects" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="heading-dlf font-display text-2xl font-semibold">Portfolio projects</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Site-facing developments (cover, copy, maps, galleries). For property listings inventory, use{' '}
            <Link to="/admin/projects" className="text-gold hover:underline">
              Listings
            </Link>
            .
          </p>
        </div>
        <Link
          to="/admin/site-projects/new"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy"
        >
          <Plus className="h-4 w-4" />
          Add project
        </Link>
      </div>
      {loading ? (
        <p className="mt-8">Loading…</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
              <tr>
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Slug</th>
                <th className="p-3 font-semibold">Location label</th>
                <th className="p-3 font-semibold">Published</th>
                <th className="p-3 font-semibold">Sort</th>
                <th className="p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b border-neutral-100 dark:border-neutral-800">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 font-mono text-xs text-neutral-600 dark:text-neutral-400">{p.slug}</td>
                  <td className="p-3">{p.shortLabel || '—'}</td>
                  <td className="p-3">{p.published ? 'Yes' : 'No'}</td>
                  <td className="p-3 tabular-nums">{p.sortOrder ?? 0}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/projects/${p.slug}`}
                        className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        aria-label="View on site"
                        title="View on site"
                      >
                        <Layers className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/admin/site-projects/${p.id}/edit`}
                        className="rounded-lg p-2 text-gold hover:bg-gold/10"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                        onClick={() => remove(p.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!items.length && (
            <p className="p-8 text-center text-sm text-neutral-500">No portfolio projects yet. Create one to show on the site.</p>
          )}
        </div>
      )}
    </>
  );
}
