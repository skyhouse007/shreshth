import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bath, Bed, ChevronLeft, ChevronRight, MapPin, Maximize2 } from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../components/SEO.jsx';
import PropertyCard from '../components/PropertyCard.jsx';
import { api } from '../api/client.js';
import { WHATSAPP_DEFAULT, formatPrice, statusBadgeClass, statusLabel } from '../utils/constants.js';
import { email as emailErr, phone as phoneErr, required } from '../utils/validate.js';

export default function PropertyDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data: res } = await api.get(`/properties/slug/${slug}`);
        if (!cancelled) setData(res);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const property = data?.property;
  const related = data?.related || [];
  const images = property?.images?.length ? property.images : [];
  const mapQuery = property ? `${property.location}, ${property.city}` : '';

  const validate = () => {
    const e = {};
    const r = (v, key, fn) => {
      const x = fn(v);
      if (x) e[key] = x;
    };
    r(form.name, 'name', (v) => required(v, 'Name'));
    r(form.email, 'email', (v) => required(v, 'Email') || emailErr(v));
    r(form.phone, 'phone', (v) => required(v, 'Phone') || phoneErr(v));
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitLead = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      await api.post('/leads', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        propertyId: property._id,
      });
      toast.success('Thank you — our team will reach out shortly.');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center text-neutral-500">
        Loading…
      </div>
    );
  }
  if (!property) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center">
        <p className="text-neutral-600">Project not found.</p>
        <Link to="/projects" className="mt-4 inline-block text-gold hover:underline">
          Back to listings
        </Link>
      </div>
    );
  }

  const wa = WHATSAPP_DEFAULT
    ? `https://wa.me/${WHATSAPP_DEFAULT}?text=${encodeURIComponent(
        `Hi, I'm interested in ${property.title} (${property.slug}).`
      )}`
    : null;

  return (
    <>
      <SEO title={property.title} description={property.description.slice(0, 155)} />
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
              <AnimatePresence mode="wait">
                <motion.img
                  key={images[idx] || 'x'}
                  src={images[idx]}
                  alt=""
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="aspect-[4/3] w-full object-cover"
                />
              </AnimatePresence>
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow dark:bg-black/70"
                    onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow dark:bg-black/70"
                    onClick={() => setIdx((i) => (i + 1) % images.length)}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setIdx(i)}
                    className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${
                      i === idx ? 'border-gold' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-navy px-3 py-1 text-xs font-semibold heading-dlf text-white">
                {property.purpose === 'rent' ? 'Rent' : 'Sale'}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(property.status)}`}>
                {statusLabel(property.status)}
              </span>
              {property.featured ? (
                <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy">Featured</span>
              ) : null}
            </div>
            <h1 className="mt-4 heading-dlf font-display text-3xl font-semibold text-neutral-900 dark:text-white md:text-4xl">
              {property.title}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
              <MapPin className="h-4 w-4 text-gold" />
              {property.location} · {property.city}, {property.state}
            </p>
            <p className="mt-6 font-sans text-3xl font-bold tabular-nums text-gold-dark dark:text-gold">{formatPrice(property.price, property.purpose)}</p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
              {property.type !== 'plot' ? (
                <>
                  <span className="inline-flex items-center gap-1">
                    <Bed className="h-4 w-4 text-gold" />
                    {property.bedrooms} beds
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Bath className="h-4 w-4 text-gold" />
                    {property.bathrooms} baths
                  </span>
                </>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <Maximize2 className="h-4 w-4 text-gold" />
                {property.area?.toLocaleString('en-IN')} sqft
              </span>
              <span className="capitalize">{property.type}</span>
            </div>
            <p className="mt-8 whitespace-pre-line text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              {property.description}
            </p>
            {property.amenities?.length ? (
              <div className="mt-8">
                <h2 className="text-sm font-semibold heading-dlf text-gold">Amenities</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {property.amenities.map((a) => (
                    <li key={a} className="rounded-full bg-neutral-100 px-3 py-1 text-xs dark:bg-neutral-800">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <iframe
              title="Map"
              className="h-72 w-full border-0"
              loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=14&output=embed`}
            />
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
            <h2 className="heading-dlf font-display text-2xl font-semibold text-neutral-900 dark:text-white">Request a private tour</h2>
            <form className="mt-6 space-y-4" onSubmit={submitLead}>
              <div>
                <label className="block text-xs font-medium text-neutral-500">Name</label>
                <input
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-neutral-500">Email</label>
                  <input
                    type="email"
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500">Phone</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500">Message</label>
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-navy hover:bg-gold-dark hover:text-navy-deep"
                >
                  Submit inquiry
                </button>
                {wa ? (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-gold px-6 py-2.5 text-sm font-semibold text-gold hover:bg-gold/10"
                  >
                    WhatsApp
                  </a>
                ) : null}
              </div>
            </form>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="heading-dlf font-display text-2xl font-semibold text-neutral-900 dark:text-white">You may also like</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <PropertyCard key={p._id} property={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
