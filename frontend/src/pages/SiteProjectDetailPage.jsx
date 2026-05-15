import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../components/SEO.jsx';
import SiteProjectSection from '../components/SiteProjectSection.jsx';
import SiteProjectSectionBreak from '../components/SiteProjectSectionBreak.jsx';
import StaticProjectCard from '../components/StaticProjectCard.jsx';
import { api } from '../api/client.js';
import { WHATSAPP_DEFAULT } from '../utils/constants.js';
import { email as emailErr, phone as phoneErr, required } from '../utils/validate.js';
import { siteProjectBadgeClass, siteProjectGradientClass } from '../utils/siteProjectUi.js';
import { mergePortfolioProjects } from '../utils/mergePortfolioProjects.js';

function formatGroundPlusFloors(n) {
  if (n === null || n === undefined) return null;
  const f = typeof n === 'number' ? n : Number(n);
  if (!Number.isFinite(f) || f < 0) return null;
  if (f === 0) return 'Ground';
  return `Ground + ${f}`;
}

export default function SiteProjectDetailPage({ initialProject }) {
  const { slug } = useParams();
  const [project, setProject] = useState(initialProject ?? null);
  const [loading, setLoading] = useState(!initialProject);
  const [idx, setIdx] = useState(0);
  const [portfolio, setPortfolio] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});

  const [nearestCatsCollapsed, setNearestCatsCollapsed] = useState(() => new Set());

  useEffect(() => {
    setNearestCatsCollapsed(new Set());
  }, [slug]);

  useEffect(() => {
    setIdx(0);
  }, [slug, project]);

  useEffect(() => {
    if (initialProject?.slug === slug) {
      setProject(initialProject);
      setLoading(false);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/site-projects/${encodeURIComponent(slug)}`);
        if (!cancelled) setProject(data.project || null);
      } catch {
        if (!cancelled) setProject(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, initialProject]);

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const { data } = await api.get('/site-projects');
        if (!c) setPortfolio(Array.isArray(data.items) ? data.items : []);
      } catch {
        if (!c) setPortfolio([]);
      }
    })();
    return () => {
      c = true;
    };
  }, []);

  const gallerySlides = useMemo(() => {
    if (!project) return [];
    const list = [];
    if (typeof project.coverImage === 'string' && project.coverImage.trim()) {
      list.push({
        src: project.coverImage.trim(),
        alt: project.name || 'Project cover',
      });
    }
    (project.gallery || []).forEach((g) => {
      if (g?.src?.trim())
        list.push({ src: g.src.trim(), alt: typeof g.alt === 'string' ? g.alt : '' });
    });
    return list;
  }, [project]);

  const others = useMemo(() => {
    return mergePortfolioProjects(portfolio)
      .filter((p) => p.slug !== slug)
      .slice(0, 4);
  }, [portfolio, slug]);

  if (loading && !project) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center text-neutral-500">Loading…</div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center">
        <p className="text-neutral-600 dark:text-neutral-400">Project not found.</p>
        <Link to="/projects" className="mt-4 inline-block text-gold hover:underline">
          Back to projects
        </Link>
      </div>
    );
  }

  const themes = project.sectionThemes || {};
  const statusClass = siteProjectBadgeClass(project.statusVariant);
  const fallbackGradient = siteProjectGradientClass(project.statusVariant);
  const displayName = project.name || 'Project';
  const mapSrc = project.mapQuery?.trim()
    ? `https://maps.google.com/maps?q=${encodeURIComponent(project.mapQuery.trim())}&z=14&output=embed`
    : null;
  const resThemed = Boolean(themes.residences?.bg || themes.residences?.text);
  const overviewThemed = Boolean(themes.projectOverview?.bg || themes.projectOverview?.text);
  const inquiryThemed = Boolean(themes.inquiry?.bg || themes.inquiry?.text);

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
        message: `[Portfolio: ${displayName}] ${form.message || ''}`.trim(),
      });
      toast.success('Thank you — our team will reach out shortly.');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const wa = WHATSAPP_DEFAULT
    ? `https://wa.me/${WHATSAPP_DEFAULT}?text=${encodeURIComponent(
        `Hi, I'm interested in ${displayName}.`,
      )}`
    : null;

  const metaDesc =
    `${project.headline || displayName}${project.shortLabel ? ` — ${project.shortLabel}` : ''}`
      .trim()
      .slice(0, 155);

  const fieldBase = inquiryThemed
    ? 'mt-1 w-full rounded-xl border border-current/25 bg-white/10 px-3 py-2 text-sm placeholder:text-current/45'
    : 'mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white';

  return (
    <>
      <SEO title={displayName} description={metaDesc} />
      <section
        className="relative w-full overflow-hidden border-b border-neutral-200 bg-neutral-950 dark:border-neutral-800"
        style={themes.hero?.bg?.trim() ? { backgroundColor: themes.hero.bg.trim() } : undefined}
        aria-label="Project imagery"
      >
        <div className="group/slider relative mx-auto w-full max-w-[1920px] overflow-hidden aspect-video md:aspect-[2.35/1]">
          <motion.div
            key={`carousel-${slug}-${idx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            {gallerySlides[idx] ? (
              <img
                src={gallerySlides[idx].src}
                alt={gallerySlides[idx].alt || displayName}
                width={1920}
                height={1080}
                sizes="100vw"
                className="h-full w-full object-cover object-center"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            ) : (
              <div className={`h-full w-full bg-gradient-to-br ${fallbackGradient}`} aria-hidden />
            )}
          </motion.div>
          {gallerySlides.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                className="absolute left-2 top-1/2 z-10 flex -translate-y-1/2 rounded-full bg-black/45 p-2 text-white backdrop-blur-sm transition hover:bg-black/60 md:left-3 md:bg-black/35 md:opacity-0 md:group-hover/slider:opacity-100"
                onClick={() =>
                  setIdx((i) => (i - 1 + gallerySlides.length) % gallerySlides.length)
                }
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                className="absolute right-2 top-1/2 z-10 flex -translate-y-1/2 rounded-full bg-black/45 p-2 text-white backdrop-blur-sm transition hover:bg-black/60 md:right-3 md:bg-black/35 md:opacity-0 md:group-hover/slider:opacity-100"
                onClick={() => setIdx((i) => (i + 1) % gallerySlides.length)}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
            </>
          ) : null}
        </div>
      </section>

      <SiteProjectSectionBreak images={project.sectionBreakImages?.hero} />

      <SiteProjectSection sectionKey="intro" themes={themes}>
        <div className="flex flex-wrap items-center gap-2">
          <span
            data-theme-preserve
            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
          >
            {project.statusLabel}
          </span>
          <span
            data-theme-preserve
            className="rounded-full bg-navy px-3 py-1 text-xs font-semibold heading-dlf text-white"
          >
            Portfolio
          </span>
        </div>
        <h1 className="mt-4 heading-dlf font-display text-3xl font-semibold text-neutral-900 dark:text-white md:text-4xl">
          {displayName}
        </h1>
        {project.shortLabel ? (
          <p className="mt-2 flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <MapPin className="h-4 w-4 shrink-0 text-gold" aria-hidden />
            {project.shortLabel}
          </p>
        ) : null}
        {project.headline ? (
          <p className="mt-4 text-lg font-medium text-neutral-800 dark:text-neutral-200">
            {project.headline}
          </p>
        ) : null}
        {project.about ? (
          <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            {project.about}
          </p>
        ) : null}
      </SiteProjectSection>

      <SiteProjectSectionBreak images={project.sectionBreakImages?.intro} />

      {(() => {
        const area = project.totalProjectArea?.trim();
        const open = project.openSpace?.trim();
        const towers =
          project.totalTowers != null && Number.isFinite(Number(project.totalTowers)) ?
            Number(project.totalTowers)
          : null;
        const floorsLabel = formatGroundPlusFloors(project.floorsAboveGround);
        const hasOverview = Boolean(area || open || towers !== null || floorsLabel);
        if (!hasOverview) return null;
        return (
          <SiteProjectSection sectionKey="projectOverview" themes={themes}>
            <h2 className="heading-dlf font-display text-2xl font-semibold text-neutral-900 dark:text-white">
              Project overview
            </h2>
            <div
              className={
                overviewThemed
                  ? 'mt-6 overflow-hidden rounded-2xl border border-current/20 bg-black/10'
                  : 'mt-6 overflow-hidden rounded-2xl border border-navy/30 bg-navy text-[#f4f0e6] shadow-lg dark:border-white/10 dark:bg-navy-deep'
              }
            >
              <table className="w-full text-left text-sm">
                <thead
                  className={
                    overviewThemed
                      ? 'border-b border-current/20 bg-black/15'
                      : 'border-b border-white/15 bg-black/25'
                  }
                >
                  <tr>
                    <th
                      className={
                        overviewThemed
                          ? 'p-4 font-semibold tracking-wide'
                          : 'p-4 font-semibold tracking-wide text-[#faf6ef]'
                      }
                    >
                      Total project area
                    </th>
                    <th
                      className={
                        overviewThemed
                          ? 'p-4 font-semibold tracking-wide'
                          : 'p-4 font-semibold tracking-wide text-[#faf6ef]'
                      }
                    >
                      Open space
                    </th>
                    <th
                      className={
                        overviewThemed
                          ? 'p-4 font-semibold tracking-wide'
                          : 'p-4 font-semibold tracking-wide text-[#faf6ef]'
                      }
                    >
                      Total towers
                    </th>
                    <th
                      className={
                        overviewThemed
                          ? 'p-4 font-semibold tracking-wide'
                          : 'p-4 font-semibold tracking-wide text-[#faf6ef]'
                      }
                    >
                      Floors
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    className={
                      overviewThemed
                        ? 'border-b border-current/15 odd:bg-black/[0.07]'
                        : 'border-b border-white/10 odd:bg-white/[0.04]'
                    }
                  >
                    <td
                      className={
                        overviewThemed ? 'p-4 font-medium' : 'p-4 font-medium text-[#faf6ef]'
                      }
                    >
                      {area || '—'}
                    </td>
                    <td
                      className={
                        overviewThemed ? 'p-4 whitespace-pre-line opacity-90' : 'p-4 whitespace-pre-line text-[#e8e0d4]'
                      }
                    >
                      {open || '—'}
                    </td>
                    <td
                      className={
                        overviewThemed ? 'p-4 opacity-90 tabular-nums' : 'p-4 text-[#e8e0d4] tabular-nums'
                      }
                    >
                      {towers !== null ? towers.toLocaleString('en-IN') : '—'}
                    </td>
                    <td
                      className={
                        overviewThemed ? 'p-4 opacity-90' : 'p-4 text-[#e8e0d4]'
                      }
                    >
                      {floorsLabel || '—'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SiteProjectSection>
        );
      })()}

      <SiteProjectSectionBreak images={project.sectionBreakImages?.projectOverview} />

      {project.flatTypes?.length ? (
        <SiteProjectSection sectionKey="residences" themes={themes}>
          <h2 className="heading-dlf font-display text-2xl font-semibold text-neutral-900 dark:text-white">
            Available residences
          </h2>
          <div
            className={
              resThemed
                ? 'mt-6 overflow-hidden rounded-2xl border border-current/20 bg-black/10'
                : 'mt-6 overflow-hidden rounded-2xl border border-navy/30 bg-navy text-[#f4f0e6] shadow-lg dark:border-white/10 dark:bg-navy-deep'
            }
          >
            <table className="w-full text-left text-sm">
              <thead
                className={
                  resThemed
                    ? 'border-b border-current/20 bg-black/15'
                    : 'border-b border-white/15 bg-black/25'
                }
              >
                <tr>
                  <th
                    className={
                      resThemed
                        ? 'p-4 font-semibold tracking-wide'
                        : 'p-4 font-semibold tracking-wide text-[#faf6ef]'
                    }
                  >
                    Configuration
                  </th>
                  <th
                    className={
                      resThemed
                        ? 'p-4 font-semibold tracking-wide'
                        : 'p-4 font-semibold tracking-wide text-[#faf6ef]'
                    }
                  >
                    Super built-up (sq ft)
                  </th>
                  <th
                    className={
                      resThemed
                        ? 'p-4 font-semibold tracking-wide'
                        : 'p-4 font-semibold tracking-wide text-[#faf6ef]'
                    }
                  >
                    Carpet (sq ft)
                  </th>
                </tr>
              </thead>
              <tbody>
                {project.flatTypes.map((row, i) => (
                  <tr
                    key={i}
                    className={
                      resThemed
                        ? 'border-b border-current/15 last:border-b-0 odd:bg-black/[0.07]'
                        : 'border-b border-white/10 last:border-b-0 odd:bg-white/[0.04] hover:bg-white/[0.07]'
                    }
                  >
                    <td
                      className={
                        resThemed ? 'p-4 font-medium' : 'p-4 font-medium text-[#faf6ef]'
                      }
                    >
                      {row.label}
                    </td>
                    <td
                      className={
                        resThemed ? 'p-4 opacity-90' : 'p-4 text-[#e8e0d4]'
                      }
                    >
                      {row.superBuiltUpSqft != null ? row.superBuiltUpSqft.toLocaleString('en-IN') : '—'}
                    </td>
                    <td
                      className={
                        resThemed ? 'p-4 opacity-90' : 'p-4 text-[#e8e0d4]'
                      }
                    >
                      {row.carpetSqft != null ? row.carpetSqft.toLocaleString('en-IN') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SiteProjectSection>
      ) : null}

      <SiteProjectSectionBreak images={project.sectionBreakImages?.residences} />

      {project.amenities?.length ? (
        <SiteProjectSection sectionKey="amenities" themes={themes}>
          <h2 className="heading-dlf font-display text-2xl font-semibold text-neutral-900 dark:text-white">
            Amenities
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {project.amenities.map((a) => (
              <li
                key={a}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-700 dark:border-neutral-800 dark:text-neutral-300"
              >
                {a}
              </li>
            ))}
          </ul>
        </SiteProjectSection>
      ) : null}

      <SiteProjectSectionBreak images={project.sectionBreakImages?.amenities} />

      {project.amenityImages?.length ? (
        <SiteProjectSection sectionKey="amenityImages" themes={themes}>
          <h2 className="heading-dlf font-display text-2xl font-semibold text-neutral-900 dark:text-white">
            Amenity Gallery
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.amenityImages.map((img, i) =>
              img.src?.trim() ? (
                <figure
                  key={`${img.src}-${i}`}
                  className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800"
                >
                  <img
                    src={img.src.trim()}
                    alt={img.alt || ''}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  {img.alt ? (
                    <figcaption className="p-2 text-center text-xs text-neutral-600 dark:text-neutral-400">
                      {img.alt}
                    </figcaption>
                  ) : null}
                </figure>
              ) : null,
            )}
          </div>
        </SiteProjectSection>
      ) : null}

      <SiteProjectSectionBreak images={project.sectionBreakImages?.amenityImages} />

      <SiteProjectSection sectionKey="location" themes={themes}>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
          <div className="flex min-h-0 flex-col">
            {mapSrc ? (
              <div className="flex h-full min-h-[18rem] flex-1 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
                <iframe
                  title="Map"
                  className="block h-72 min-h-[18rem] w-full flex-1 border-0 lg:h-full lg:min-h-0"
                  loading="lazy"
                  src={mapSrc}
                />
              </div>
            ) : (
              <div className="flex h-72 min-h-[18rem] flex-1 items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 text-sm text-neutral-500 lg:min-h-0 lg:flex-1 dark:border-neutral-700 dark:bg-neutral-900">
                Add a location query in admin to show the map.
              </div>
            )}
          </div>
          <div className="flex min-h-0 flex-col">
            <div className="flex w-full flex-1 flex-col rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
              <h2 className="heading-dlf font-display text-xl font-semibold text-neutral-900 dark:text-white">
                Nearest to project
              </h2>
              {(() => {
                const groups =
                  Array.isArray(project.nearestCategories) &&
                  project.nearestCategories.some((c) => (c.places || []).length > 0)
                    ? project.nearestCategories
                    : project.nearestPlaces?.length ?
                      [{ label: '', places: project.nearestPlaces }]
                    : [];
                const hasNearest = groups.some((c) => (c.places || []).length > 0);
                if (!hasNearest) {
                  return (
                    <p className="mt-4 text-sm text-neutral-500">
                      Distances can be added from the admin panel.
                    </p>
                  );
                }
                return (
                  <div className="mt-4 flex-1 space-y-8 text-sm">
                    {groups.map((cat, gi) =>
                      !(cat.places || []).length ? null : (
                        <div key={`near-cat-${gi}`}>
                          {cat.label?.trim() ? (
                            <button
                              type="button"
                              className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg py-1 text-left outline-none hover:bg-neutral-100/80 focus-visible:ring-2 focus-visible:ring-gold/60 dark:hover:bg-neutral-800/80"
                              aria-expanded={!nearestCatsCollapsed.has(gi)}
                              aria-controls={`nearest-places-${gi}`}
                              id={`nearest-cat-trigger-${gi}`}
                              onClick={() =>
                                setNearestCatsCollapsed((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(gi)) next.delete(gi);
                                  else next.add(gi);
                                  return next;
                                })
                              }
                            >
                              <h3 className="min-w-0 flex-1 heading-dlf text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
                                {cat.label.trim()}
                              </h3>
                              <span
                                className="flex shrink-0 rounded-md border border-neutral-300 bg-white p-1 text-neutral-600 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-300"
                                aria-hidden
                              >
                                {nearestCatsCollapsed.has(gi) ? (
                                  <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                                ) : (
                                  <Minus className="h-3.5 w-3.5" strokeWidth={2} />
                                )}
                              </span>
                            </button>
                          ) : null}
                          {cat.label?.trim() && nearestCatsCollapsed.has(gi) ? null : (
                            <ul
                              id={cat.label?.trim() ? `nearest-places-${gi}` : undefined}
                              role={cat.label?.trim() ? 'region' : undefined}
                              aria-labelledby={cat.label?.trim() ? `nearest-cat-trigger-${gi}` : undefined}
                              className={`space-y-3 ${cat.label?.trim() ? 'mt-2' : ''}`}
                            >
                              {cat.places.map((n, i) => (
                                <li
                                  key={`${n.label}-${gi}-${i}`}
                                  className="flex justify-between gap-4 border-b border-neutral-200 pb-3 last:border-0 dark:border-neutral-700"
                                >
                                  <span className="text-neutral-800 dark:text-neutral-200">{n.label}</span>
                                  <span className="shrink-0 tabular-nums text-neutral-600 dark:text-neutral-400">
                                    {n.distanceKm} km
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </SiteProjectSection>

      <SiteProjectSectionBreak images={project.sectionBreakImages?.location} />

      <SiteProjectSection sectionKey="inquiry" themes={themes}>
        <div className="flex justify-center">
          <div
            className={
              inquiryThemed ?
                'w-full max-w-md rounded-2xl border border-current/25 bg-black/10 p-6 shadow-xl shadow-black/25 md:p-8'
              : 'w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-900/10 dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-black/40 md:p-8'
            }
          >
            <h2 className="heading-dlf font-display text-2xl font-semibold text-neutral-900 dark:text-white">
              Book a site visit
            </h2>
            <form className="mt-6 space-y-4" onSubmit={submitLead}>
              <div>
                <label className="block text-xs font-medium text-neutral-500">Name</label>
                <input
                  className={fieldBase}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                {errors.name && (
                  <p data-theme-preserve className="mt-1 text-xs text-red-600">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-neutral-500">Email</label>
                  <input
                    type="email"
                    className={fieldBase}
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                  {errors.email && (
                    <p data-theme-preserve className="mt-1 text-xs text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500">Phone</label>
                  <input
                    className={fieldBase}
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                  {errors.phone && (
                    <p data-theme-preserve className="mt-1 text-xs text-red-600">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500">Message</label>
                <textarea
                  rows={3}
                  className={fieldBase}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  data-theme-preserve
                  type="submit"
                  className="rounded-none border border-neutral-300 bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-white dark:text-navy-deep"
                >
                  Submit inquiry
                </button>
                {wa ? (
                  <a
                    data-theme-preserve
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
      </SiteProjectSection>

      <SiteProjectSectionBreak images={project.sectionBreakImages?.inquiry} />

      {others.length > 0 ? (
        <>
          <SiteProjectSection sectionKey="otherDevelopments" themes={themes}>
            <h2 className="heading-dlf font-display text-2xl font-semibold text-neutral-900 dark:text-white">
              Other developments
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              {others.map((p, i) => (
                <StaticProjectCard key={p.slug || p.id} project={p} index={i} />
              ))}
            </div>
          </SiteProjectSection>
          <SiteProjectSectionBreak images={project.sectionBreakImages?.otherDevelopments} />
        </>
      ) : null}
    </>
  );
}
