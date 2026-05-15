import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import SEO from '../../components/SEO.jsx';
import { api } from '../../api/client.js';

const empty = {
  title: '',
  slug: '',
  description: '',
  location: '',
  city: '',
  state: 'Maharashtra',
  type: 'apartment',
  purpose: 'sale',
  bedrooms: 3,
  bathrooms: 3,
  area: '',
  price: '',
  amenities: '',
  featured: false,
  status: 'active',
};

export default function AdminPropertyForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get(`/properties/admin/${id}`);
        if (cancelled) return;
        setForm({
          title: data.title || '',
          slug: data.slug || '',
          description: data.description || '',
          location: data.location || '',
          city: data.city || '',
          state: data.state || '',
          type: data.type || 'apartment',
          purpose: data.purpose || 'sale',
          bedrooms: data.bedrooms ?? 0,
          bathrooms: data.bathrooms ?? 0,
          area: data.area ?? '',
          price: data.price ?? '',
          amenities: Array.isArray(data.amenities) ? data.amenities.join(', ') : '',
          featured: Boolean(data.featured),
          status: data.status || 'active',
        });
      } catch {
        toast.error('Failed to load property');
        navigate('/admin/projects');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isEdit, navigate]);

  const onChange = (key) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: v }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      if (form.slug) fd.append('slug', form.slug);
      fd.append('description', form.description);
      fd.append('location', form.location);
      fd.append('city', form.city);
      fd.append('state', form.state);
      fd.append('type', form.type);
      fd.append('purpose', form.purpose);
      fd.append('bedrooms', String(form.bedrooms));
      fd.append('bathrooms', String(form.bathrooms));
      fd.append('area', String(form.area));
      fd.append('price', String(form.price));
      fd.append('amenities', form.amenities);
      fd.append('featured', form.featured ? 'true' : 'false');
      fd.append('status', form.status);
      files.forEach((f) => fd.append('images', f));

      if (isEdit) {
        if (files.length) fd.append('replaceImages', 'false');
        await api.put(`/properties/${id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Property updated');
      } else {
        await api.post('/properties', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Property created');
      }
      navigate('/admin/projects');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <>
      <SEO title={isEdit ? 'Edit property' : 'New property'} />
      <h1 className="heading-dlf font-display text-2xl font-semibold">{isEdit ? 'Edit property' : 'New property'}</h1>
      <form className="mt-8 max-w-2xl space-y-4" onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-medium heading-dlf text-neutral-500">
            Title
            <input required className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" value={form.title} onChange={onChange('title')} />
          </label>
          <label className="block text-xs font-medium heading-dlf text-neutral-500">
            Slug (optional)
            <input className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" value={form.slug} onChange={onChange('slug')} />
          </label>
        </div>
        <label className="block text-xs font-medium heading-dlf text-neutral-500">
          Description
          <textarea required rows={4} className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" value={form.description} onChange={onChange('description')} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-medium heading-dlf text-neutral-500">
            Location
            <input required className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" value={form.location} onChange={onChange('location')} />
          </label>
          <label className="block text-xs font-medium heading-dlf text-neutral-500">
            City
            <input required className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" value={form.city} onChange={onChange('city')} />
          </label>
          <label className="block text-xs font-medium heading-dlf text-neutral-500">
            State
            <input required className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" value={form.state} onChange={onChange('state')} />
          </label>
          <label className="block text-xs font-medium heading-dlf text-neutral-500">
            Type
            <select className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" value={form.type} onChange={onChange('type')}>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="plot">Plot</option>
            </select>
          </label>
          <label className="block text-xs font-medium heading-dlf text-neutral-500">
            Purpose
            <select className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" value={form.purpose} onChange={onChange('purpose')}>
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
            </select>
          </label>
          <label className="block text-xs font-medium heading-dlf text-neutral-500">
            Status
            <select className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" value={form.status} onChange={onChange('status')}>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-xs font-medium heading-dlf text-neutral-500">
            Bedrooms
            <input type="number" min={0} className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" value={form.bedrooms} onChange={onChange('bedrooms')} />
          </label>
          <label className="block text-xs font-medium heading-dlf text-neutral-500">
            Bathrooms
            <input type="number" min={0} className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" value={form.bathrooms} onChange={onChange('bathrooms')} />
          </label>
          <label className="block text-xs font-medium heading-dlf text-neutral-500">
            Area (sqft)
            <input required type="number" min={0} className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" value={form.area} onChange={onChange('area')} />
          </label>
        </div>
        <label className="block text-xs font-medium heading-dlf text-neutral-500">
          Price (INR)
          <input required type="number" min={0} className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" value={form.price} onChange={onChange('price')} />
        </label>
        <label className="block text-xs font-medium heading-dlf text-neutral-500">
          Amenities (comma separated)
          <input className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" value={form.amenities} onChange={onChange('amenities')} />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={onChange('featured')} />
          Featured on homepage
        </label>
        <label className="block text-xs font-medium heading-dlf text-neutral-500">
          {isEdit ? 'Add more images (appends)' : 'Images'}
          <input
            type="file"
            accept="image/*"
            multiple
            className="mt-1 w-full text-sm"
            onChange={(e) => setFiles([...e.target.files])}
          />
        </label>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-navy hover:bg-gold-dark hover:text-navy-deep disabled:opacity-60">
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button type="button" className="rounded-full border border-neutral-300 px-6 py-2.5 text-sm dark:border-neutral-600" onClick={() => navigate('/admin/projects')}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
