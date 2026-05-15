import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ChevronDown, ChevronUp, ImagePlus, Plus, Trash2, Upload } from 'lucide-react';
import SEO from '../../components/SEO.jsx';
import { api } from '../../api/client.js';

function emptySlide() {
  return { src: '', alt: '', enabled: true };
}

export default function AdminHero() {
  const [rows, setRows] = useState([emptySlide()]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const fileRefs = useRef({});

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/site-settings');
      const list = Array.isArray(data?.heroSlides) ? data.heroSlides : [];
      const mapped = list.map((s) => ({
        src: typeof s.src === 'string' ? s.src : '',
        alt: typeof s.alt === 'string' ? s.alt : '',
        enabled: s.enabled !== false,
      }));
      setRows(mapped.length ? mapped : [emptySlide()]);
    } catch (e) {
      toast.error(e.message);
      setRows([emptySlide()]);
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
    setRows((r) => (r.length <= 1 ? [emptySlide()] : r.filter((_, i) => i !== index)));
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

  const addRow = () => setRows((r) => [...r, emptySlide()]);

  const onPickFile = async (index, fileList) => {
    const file = fileList?.[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Choose an image file');
      return;
    }
    setUploadingIndex(index);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/admin/site-settings/hero-slides/upload', fd);
      const url = typeof data?.url === 'string' ? data.url : '';
      if (!url) throw new Error('Upload did not return a URL');
      updateRow(index, { src: url });
      toast.success('Image uploaded');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setUploadingIndex(null);
      if (fileRefs.current[index]) fileRefs.current[index].value = '';
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const heroSlides = rows
        .map((row) => ({
          src: row.src.trim(),
          alt: row.alt.trim(),
          enabled: row.enabled !== false,
        }))
        .filter((row) => row.src.length > 0);
      const { data } = await api.put('/admin/site-settings/hero-slides', { heroSlides });
      const list = Array.isArray(data?.heroSlides) ? data.heroSlides : [];
      const mapped = list.map((s) => ({
        src: typeof s.src === 'string' ? s.src : '',
        alt: typeof s.alt === 'string' ? s.alt : '',
        enabled: s.enabled !== false,
      }));
      setRows(mapped.length ? mapped : [emptySlide()]);
      toast.success('Hero slides saved');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SEO title="Hero images" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ImagePlus className="hidden h-7 w-7 text-gold sm:block" aria-hidden />
          <h1 className="heading-dlf font-display text-2xl font-semibold">Hero carousel</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white"
          >
            <Plus className="h-4 w-4" />
            Add slide
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
        Images appear in the large carousel at the top of the home page. Upload goes to Cloudinary (same credentials as project
        photos), or paste any image URL. Order matches slide order; disable a slide to hide it without deleting the URL.
      </p>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
        If you save with no slides, the site keeps its built-in default hero images.
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
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex h-24 w-40 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-950">
                  {row.src ? (
                    <img src={row.src} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">No image</div>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <label className="text-xs font-medium text-neutral-500">Image URL</label>
                  <input
                    type="url"
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                    value={row.src}
                    onChange={(e) => updateRow(index, { src: e.target.value })}
                    placeholder="https://…"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={(el) => {
                        fileRefs.current[index] = el;
                      }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onPickFile(index, e.target.files)}
                    />
                    <button
                      type="button"
                      disabled={uploadingIndex === index}
                      onClick={() => fileRefs.current[index]?.click()}
                      className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      {uploadingIndex === index ? 'Uploading…' : 'Upload image'}
                    </button>
                  </div>
                  <label className="text-xs font-medium text-neutral-500">Alt text (accessibility)</label>
                  <textarea
                    rows={2}
                    className="w-full resize-y rounded-xl border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                    value={row.alt}
                    onChange={(e) => updateRow(index, { alt: e.target.value })}
                    placeholder="Describe the image for screen readers."
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
