import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import SEO from '../../components/SEO.jsx';
import { api } from '../../api/client.js';

function emptyRow() {
  return { text: '', enabled: true };
}

export default function AdminAnnouncements() {
  const [rows, setRows] = useState([emptyRow()]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/site-settings');
      const list = Array.isArray(data?.announcements) ? data.announcements : [];
      const mapped = list.map((a) => ({
        text: typeof a.text === 'string' ? a.text : '',
        enabled: a.enabled !== false,
      }));
      setRows(mapped.length ? mapped : [emptyRow()]);
    } catch (e) {
      toast.error(e.message);
      setRows([emptyRow()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateRow = (index, patch) => {
    setRows((r) => r.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const removeRow = (index) => {
    setRows((r) => (r.length <= 1 ? [emptyRow()] : r.filter((_, i) => i !== index)));
  };

  const moveRow = (index, delta) => {
    setRows((r) => {
      const j = index + delta;
      if (j < 0 || j >= r.length) return r;
      const next = [...r];
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  };

  const addRow = () => setRows((r) => [...r, emptyRow()]);

  const save = async () => {
    setSaving(true);
    try {
      const announcements = rows
        .map((row) => ({
          text: row.text.trim(),
          enabled: row.enabled !== false,
        }))
        .filter((row) => row.text.length > 0);
      const { data } = await api.put('/admin/site-settings/announcements', { announcements });
      const list = Array.isArray(data?.announcements) ? data.announcements : [];
      const mapped = list.map((a) => ({
        text: typeof a.text === 'string' ? a.text : '',
        enabled: a.enabled !== false,
      }));
      setRows(mapped.length ? mapped : [emptyRow()]);
      toast.success('Announcements saved');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SEO title="Announcements" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="heading-dlf font-display text-2xl font-semibold">Announcements</h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white"
          >
            <Plus className="h-4 w-4" />
            Add line
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving || loading}
            className="rounded-full bg-gold px-6 py-2 text-sm font-semibold text-navy disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
        Messages appear in the gold bar at the top of the public site. Multiple lines scroll together on desktop; on small screens they stay centered without animation.
      </p>

      {loading ? (
        <p className="mt-8">Loading…</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {rows.map((row, index) => (
            <li
              key={index}
              className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex flex-wrap items-start gap-3">
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <label className="text-xs font-medium text-neutral-500">Message</label>
                  <textarea
                    rows={2}
                    className="w-full resize-y rounded-xl border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                    value={row.text}
                    onChange={(e) => updateRow(index, { text: e.target.value })}
                    placeholder="e.g. New launch in Sector 62 — book a site visit today."
                    maxLength={500}
                  />
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                    <input
                      type="checkbox"
                      className="rounded border-neutral-300 text-gold focus:ring-gold dark:border-neutral-600"
                      checked={row.enabled}
                      onChange={(e) => updateRow(index, { enabled: e.target.checked })}
                    />
                    Show on site
                  </label>
                </div>
                <div className="flex shrink-0 flex-col gap-1 border-l border-neutral-200 pl-3 dark:border-neutral-700 sm:flex-row sm:border-l-0 sm:pl-0">
                  <button
                    type="button"
                    className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 disabled:pointer-events-none disabled:opacity-30 dark:text-neutral-400 dark:hover:bg-neutral-800"
                    aria-label="Move up"
                    onClick={() => moveRow(index, -1)}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 disabled:pointer-events-none disabled:opacity-30 dark:text-neutral-400 dark:hover:bg-neutral-800"
                    aria-label="Move down"
                    onClick={() => moveRow(index, 1)}
                    disabled={index === rows.length - 1}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                    aria-label="Remove"
                    onClick={() => removeRow(index)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
