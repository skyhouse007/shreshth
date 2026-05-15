import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../../components/SEO.jsx';
import { api } from '../../api/client.js';
import SectionBreakImagesEditor from '../../components/admin/SectionBreakImagesEditor.jsx';
import {
  SITE_PROJECT_SECTION_KEYS,
  SITE_PROJECT_SECTION_THEMES,
  emptySectionBreakImages,
  sectionBreakImagesFromApi,
} from '../../constants/siteProjectSections.js';
import { SITE_PROJECT_STATUS_VARIANTS } from '../../utils/siteProjectUi.js';

function emptyFlat() {
  return { label: '', superBuiltUpSqft: '', carpetSqft: '' };
}

function emptyImg() {
  return { src: '', alt: '' };
}

function emptyNear() {
  return { label: '', distanceKm: '' };
}

/** Nearest distances: categories with nested places (loads legacy flat `nearestPlaces` as one group). */
function nearestFormFromApi(p) {
  const nc = Array.isArray(p?.nearestCategories) ? p.nearestCategories : [];
  const mapped = nc.map((c) => ({
    label: c.label || '',
    places: (c.places || []).map((n) => ({
      label: n.label || '',
      distanceKm: n.distanceKm ?? '',
    })),
  }));
  const hasNc = mapped.some((c) => (c.label || '').trim() || (c.places || []).length > 0);
  if (hasNc) return { nearestCategories: mapped };
  const legacy = Array.isArray(p?.nearestPlaces) ? p.nearestPlaces : [];
  if (legacy.length) {
    return {
      nearestCategories: [
        {
          label: '',
          places: legacy.map((n) => ({
            label: n.label || '',
            distanceKm: n.distanceKm ?? '',
          })),
        },
      ],
    };
  }
  return { nearestCategories: [] };
}

function emptySectionThemes() {
  return SITE_PROJECT_SECTION_THEMES.reduce((acc, { key }) => {
    acc[key] = { bg: '', text: '' };
    return acc;
  }, {});
}

/** Merge stored sectionThemes onto the canonical keys (matches GET load + POST/PUT responses). */
function sectionThemesFromApi(raw) {
  const base = emptySectionThemes();
  const s = raw && typeof raw === 'object' ? raw : {};
  for (const { key } of SITE_PROJECT_SECTION_THEMES) {
    if (s[key] && typeof s[key] === 'object') {
      base[key] = {
        bg: typeof s[key].bg === 'string' ? s[key].bg : '',
        text: typeof s[key].text === 'string' ? s[key].text : '',
      };
    }
  }
  return base;
}

function defaults() {
  return {
    name: '',
    slug: '',
    headline: '',
    shortLabel: '',
    statusLabel: 'Upcoming',
    statusVariant: 'violet',
    coverImage: '',
    about: '',
    openSpace: '',
    totalProjectArea: '',
    totalTowers: '',
    floorsAboveGround: '',
    flatTypes: [],
    amenities: [],
    amenityImages: [],
    gallery: [],
    mapQuery: '',
    nearestCategories: [],
    sortOrder: 0,
    published: true,
    sectionThemes: emptySectionThemes(),
    sectionBreakImages: emptySectionBreakImages(),
  };
}

export default function AdminSiteProjectForm() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const [form, setForm] = useState(defaults);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null);
  const coverInput = useRef(null);

  const [nearestCatOpen, setNearestCatOpen] = useState({});

  const patch = (p) => setForm((f) => ({ ...f, ...p }));

  const isUploading = (key) => uploadingKey === key;

  const uploadFile = async (file) => {
    if (!file?.type?.startsWith('image/')) {
      toast.error('Choose an image file');
      return null;
    }
    const fd = new FormData();
    fd.append('image', file);
    const { data } = await api.post('/admin/site-projects/upload', fd);
    const url = typeof data?.url === 'string' ? data.url : '';
    if (!url) {
      toast.error('Upload failed');
      return null;
    }
    return url;
  };

  useEffect(() => {
    if (isNew) return;
    let c = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/admin/site-projects/${id}`);
        const p = data.project;
        if (!c && p) {
          setForm({
            name: p.name || '',
            slug: p.slug || '',
            headline: p.headline || '',
            shortLabel: p.shortLabel || '',
            statusLabel: p.statusLabel || 'Upcoming',
            statusVariant: SITE_PROJECT_STATUS_VARIANTS.includes(p.statusVariant)
              ? p.statusVariant
              : 'violet',
            coverImage: p.coverImage || '',
            about: p.about || '',
            openSpace: p.openSpace || '',
            totalProjectArea: p.totalProjectArea || '',
            totalTowers:
              p.totalTowers != null && Number.isFinite(Number(p.totalTowers)) ?
                String(p.totalTowers)
              : '',
            floorsAboveGround:
              p.floorsAboveGround != null && Number.isFinite(Number(p.floorsAboveGround)) ?
                String(p.floorsAboveGround)
              : '',
            flatTypes: (p.flatTypes || []).map((r) => ({
              label: r.label || '',
              superBuiltUpSqft: r.superBuiltUpSqft ?? '',
              carpetSqft: r.carpetSqft ?? '',
            })),
            amenities: p.amenities?.length ? [...p.amenities] : [],
            amenityImages: (p.amenityImages || []).map((i) => ({
              src: i.src || '',
              alt: i.alt || '',
            })),
            gallery: (p.gallery || []).map((i) => ({ src: i.src || '', alt: i.alt || '' })),
            mapQuery: p.mapQuery || '',
            ...nearestFormFromApi(p),
            sortOrder: p.sortOrder ?? 0,
            published: p.published !== false,
            sectionThemes: sectionThemesFromApi(p.sectionThemes),
            sectionBreakImages: sectionBreakImagesFromApi(p.sectionBreakImages),
          });
        }
      } catch (e) {
        if (!c) toast.error(e.message);
      } finally {
        if (!c) setLoading(false);
      }
    })();
    return () => {
      c = true;
    };
  }, [id, isNew]);

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        headline: form.headline.trim(),
        shortLabel: form.shortLabel.trim(),
        statusLabel: form.statusLabel.trim(),
        statusVariant: form.statusVariant,
        coverImage: form.coverImage.trim(),
        about: form.about,
        openSpace: form.openSpace,
        totalProjectArea: form.totalProjectArea.trim(),
        totalTowers: form.totalTowers === '' ? null : Number(form.totalTowers),
        floorsAboveGround: form.floorsAboveGround === '' ? null : Number(form.floorsAboveGround),
        flatTypes: form.flatTypes
          .filter((r) => r.label.trim())
          .map((r) => ({
            label: r.label.trim(),
            superBuiltUpSqft: r.superBuiltUpSqft === '' ? null : Number(r.superBuiltUpSqft),
            carpetSqft: r.carpetSqft === '' ? null : Number(r.carpetSqft),
          })),
        amenities: form.amenities.map((a) => a.trim()).filter(Boolean),
        amenityImages: form.amenityImages.filter((i) => i.src.trim()),
        gallery: form.gallery.filter((i) => i.src.trim()),
        mapQuery: form.mapQuery.trim(),
        nearestCategories: (form.nearestCategories || [])
          .map((cat) => ({
            label: (cat.label || '').trim(),
            places: (cat.places || [])
              .filter((n) => (n.label || '').trim() && n.distanceKm !== '')
              .map((n) => ({
                label: n.label.trim(),
                distanceKm: Number(n.distanceKm),
              })),
          }))
          .filter((cat) => cat.label || cat.places.length > 0),
        sortOrder: Number(form.sortOrder) || 0,
        published: form.published,
        sectionThemes: form.sectionThemes,
        sectionBreakImages: SITE_PROJECT_SECTION_KEYS.reduce((acc, key) => {
          acc[key] = (form.sectionBreakImages[key] || [])
            .filter((i) => (i.src || '').trim())
            .map((i) => ({ src: (i.src || '').trim(), alt: (i.alt || '').trim() }));
          return acc;
        }, {}),
      };
      if (isNew) {
        const { data } = await api.post('/admin/site-projects', payload);
        toast.success('Project created');
        navigate(`/admin/site-projects/${data.project?.id}/edit`);
      } else {
        const { data } = await api.put(`/admin/site-projects/${id}`, payload);
        toast.success('Saved');
        const p = data.project;
        if (data.project) {
          patch({
            sectionThemes: sectionThemesFromApi(data.project.sectionThemes),
            sectionBreakImages: sectionBreakImagesFromApi(data.project.sectionBreakImages),
            ...nearestFormFromApi(data.project),
          });
        }
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const removeProject = async () => {
    if (isNew) return;
    if (!confirm('Delete this project permanently?')) return;
    try {
      await api.delete(`/admin/site-projects/${id}`);
      toast.success('Deleted');
      navigate('/admin/site-projects');
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loading) {
    return <p className="text-neutral-500">Loading…</p>;
  }

  return (
    <>
      <SEO title={isNew ? 'New portfolio project' : 'Edit portfolio project'} />
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Link
          to="/admin/site-projects"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-gold dark:text-neutral-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>
      <h1 className="heading-dlf font-display text-2xl font-semibold">
        {isNew ? 'New portfolio project' : 'Edit portfolio project'}
      </h1>

      <form onSubmit={save} className="mt-8 max-w-4xl space-y-10">
        <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-sm font-semibold heading-dlf text-gold">Basics</h2>
          <label className="block text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Project name *</span>
            <input
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              value={form.name}
              onChange={(e) => patch({ name: e.target.value })}
              required
            />
          </label>
          <label className="block text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">URL slug (optional, auto from name if empty)</span>
            <input
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 font-mono text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              value={form.slug}
              onChange={(e) => patch({ slug: e.target.value })}
              placeholder="e.g. bodhgaya-upcoming"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">Status label</span>
              <input
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                value={form.statusLabel}
                onChange={(e) => patch({ statusLabel: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">Status color</span>
              <select
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                value={form.statusVariant}
                onChange={(e) => patch({ statusVariant: e.target.value })}
              >
                {SITE_PROJECT_STATUS_VARIANTS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Location line (shown under title)</span>
            <input
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              value={form.shortLabel}
              onChange={(e) => patch({ shortLabel: e.target.value })}
              placeholder="Bodh Gaya, Bihar"
            />
          </label>
          <label className="block text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Headline (short)</span>
            <input
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              value={form.headline}
              onChange={(e) => patch({ headline: e.target.value })}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">Sort order</span>
              <input
                type="number"
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                value={form.sortOrder}
                onChange={(e) => patch({ sortOrder: e.target.value })}
              />
            </label>
            <label className="mt-6 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => patch({ published: e.target.checked })}
              />
              Published on website
            </label>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-sm font-semibold heading-dlf text-gold">Cover image</h2>
          <p className="text-xs text-neutral-500">
            Upload from your device — stored on Cloudinary and saved as the project cover (hero + cards).
          </p>
          {form.coverImage ? (
            <img src={form.coverImage} alt="" className="max-h-48 rounded-xl border border-neutral-200 object-cover dark:border-neutral-700" />
          ) : null}
          <div className="flex flex-wrap gap-2">
            <input
              ref={coverInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = '';
                if (!file) return;
                setUploadingKey('cover');
                try {
                  const url = await uploadFile(file);
                  if (url) patch({ coverImage: url });
                  toast.success('Cover uploaded to Cloudinary');
                } catch (err) {
                  toast.error(err.message);
                } finally {
                  setUploadingKey(null);
                }
              }}
            />
            <button
              type="button"
              disabled={isUploading('cover')}
              onClick={() => coverInput.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2 text-sm dark:border-neutral-700"
            >
              <Upload className="h-4 w-4" />
              {isUploading('cover') ? 'Uploading…' : form.coverImage ? 'Replace cover' : 'Upload cover'}
            </button>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold heading-dlf text-gold">Gallery</h2>
              <p className="text-xs text-neutral-500">
                Carousel images after the cover (upload to Cloudinary). Shown together with cover on the hero.
              </p>
            </div>
            <button
              type="button"
              className="text-xs text-gold hover:underline"
              onClick={() => patch({ gallery: [...form.gallery, emptyImg()] })}
            >
              Add image
            </button>
          </div>
          {form.gallery.map((img, i) => (
            <div
              key={`gallery-${i}`}
              className="flex flex-col gap-3 rounded-xl border border-neutral-100 p-3 dark:border-neutral-800 sm:flex-row sm:items-start"
            >
              <div className="flex shrink-0 gap-2">
                {img.src ? (
                  <img
                    src={img.src}
                    alt=""
                    className="h-24 w-32 rounded-lg border border-neutral-200 object-cover dark:border-neutral-700"
                  />
                ) : (
                  <div className="flex h-24 w-32 items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 text-xs text-neutral-500 dark:border-neutral-600 dark:bg-neutral-900">
                    No image
                  </div>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id={`gallery-upload-${i}`}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    e.target.value = '';
                    if (!file) return;
                    setUploadingKey(`gallery-${i}`);
                    try {
                      const url = await uploadFile(file);
                      if (url) {
                        const gallery = [...form.gallery];
                        gallery[i] = { ...gallery[i], src: url };
                        patch({ gallery });
                      }
                      toast.success('Uploaded to Cloudinary');
                    } catch (err) {
                      toast.error(err.message);
                    } finally {
                      setUploadingKey(null);
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isUploading(`gallery-${i}`)}
                    onClick={() => document.getElementById(`gallery-upload-${i}`)?.click()}
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs dark:border-neutral-700"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {isUploading(`gallery-${i}`) ? 'Uploading…' : img.src ? 'Replace file' : 'Upload file'}
                  </button>
                </div>
                <label className="block text-xs">
                  Alt text
                  <input
                    className="mt-1 w-full rounded-lg border border-neutral-200 px-2 py-1 dark:border-neutral-700 dark:bg-neutral-950"
                    value={img.alt}
                    onChange={(e) => {
                      const gallery = [...form.gallery];
                      gallery[i] = { ...img, alt: e.target.value };
                      patch({ gallery });
                    }}
                  />
                </label>
                {img.src ? (
                  <p className="truncate text-[10px] text-neutral-400" title={img.src}>
                    {img.src.includes('cloudinary') ? 'Cloudinary' : 'Saved URL'} · {img.src.slice(-40)}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                className="self-start text-sm text-red-600 sm:ml-auto"
                onClick={() => patch({ gallery: form.gallery.filter((_, j) => j !== i) })}
              >
                Remove
              </button>
            </div>
          ))}
        </section>

        <SectionBreakImagesEditor
          sectionKey="hero"
          title="Hero carousel"
          subtitle="Full-width strip on the site immediately after the hero carousel, before the About block."
          images={form.sectionBreakImages.hero}
          onChange={(next) => patch({ sectionBreakImages: { ...form.sectionBreakImages, hero: next } })}
          uploadFile={uploadFile}
          isUploading={isUploading}
          setUploadingKey={setUploadingKey}
        />

        <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-sm font-semibold heading-dlf text-gold">About</h2>
          <label className="block text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">About the project</span>
            <textarea
              rows={6}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              value={form.about}
              onChange={(e) => patch({ about: e.target.value })}
            />
          </label>
        </section>

        <SectionBreakImagesEditor
          sectionKey="intro"
          title="Intro"
          subtitle="Shown after the title / about section, before Project overview (if any)."
          images={form.sectionBreakImages.intro}
          onChange={(next) =>
            patch({ sectionBreakImages: { ...form.sectionBreakImages, intro: next } })
          }
          uploadFile={uploadFile}
          isUploading={isUploading}
          setUploadingKey={setUploadingKey}
        />

        <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-sm font-semibold heading-dlf text-gold">Project overview</h2>
          <p className="text-xs text-neutral-500">
            One-row summary table on the public project page — same styling as Available residences.
            Floors: enter how many floors are above ground; the site shows Ground + N (use 0 for ground only).
          </p>
          <label className="block text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Total project area</span>
            <input
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              placeholder="e.g. 2.5 acres or sq. ft figures"
              value={form.totalProjectArea}
              onChange={(e) => patch({ totalProjectArea: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Open space</span>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              value={form.openSpace}
              onChange={(e) => patch({ openSpace: e.target.value })}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">Total towers</span>
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                value={form.totalTowers}
                onChange={(e) => patch({ totalTowers: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">Floors above ground</span>
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                value={form.floorsAboveGround}
                onChange={(e) => patch({ floorsAboveGround: e.target.value })}
              />
            </label>
          </div>
        </section>

        <SectionBreakImagesEditor
          sectionKey="projectOverview"
          title="Project overview"
          subtitle="Placed after the stats table (or in that position if the overview table is empty)."
          images={form.sectionBreakImages.projectOverview}
          onChange={(next) =>
            patch({ sectionBreakImages: { ...form.sectionBreakImages, projectOverview: next } })
          }
          uploadFile={uploadFile}
          isUploading={isUploading}
          setUploadingKey={setUploadingKey}
        />

        <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold heading-dlf text-gold">Flat types</h2>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2 py-1 text-xs dark:border-neutral-700"
              onClick={() => patch({ flatTypes: [...form.flatTypes, emptyFlat()] })}
            >
              <Plus className="h-3 w-3" /> Add row
            </button>
          </div>
          <div className="space-y-3">
            {form.flatTypes.map((row, i) => (
              <div key={i} className="flex flex-wrap gap-2 rounded-xl border border-neutral-100 p-3 dark:border-neutral-800">
                <input
                  placeholder="2 BHK"
                  className="min-w-[6rem] flex-1 rounded-lg border border-neutral-200 px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                  value={row.label}
                  onChange={(e) => {
                    const flatTypes = [...form.flatTypes];
                    flatTypes[i] = { ...row, label: e.target.value };
                    patch({ flatTypes });
                  }}
                />
                <input
                  type="number"
                  placeholder="Super built (sq ft)"
                  className="w-32 rounded-lg border border-neutral-200 px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                  value={row.superBuiltUpSqft}
                  onChange={(e) => {
                    const flatTypes = [...form.flatTypes];
                    flatTypes[i] = { ...row, superBuiltUpSqft: e.target.value };
                    patch({ flatTypes });
                  }}
                />
                <input
                  type="number"
                  placeholder="Carpet (sq ft)"
                  className="w-32 rounded-lg border border-neutral-200 px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                  value={row.carpetSqft}
                  onChange={(e) => {
                    const flatTypes = [...form.flatTypes];
                    flatTypes[i] = { ...row, carpetSqft: e.target.value };
                    patch({ flatTypes });
                  }}
                />
                <button
                  type="button"
                  className="p-1 text-red-600"
                  onClick={() => patch({ flatTypes: form.flatTypes.filter((_, j) => j !== i) })}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <SectionBreakImagesEditor
          sectionKey="residences"
          title="Available residences"
          subtitle="Shown after the residences table."
          images={form.sectionBreakImages.residences}
          onChange={(next) =>
            patch({ sectionBreakImages: { ...form.sectionBreakImages, residences: next } })
          }
          uploadFile={uploadFile}
          isUploading={isUploading}
          setUploadingKey={setUploadingKey}
        />

        <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-sm font-semibold heading-dlf text-gold">Amenities (list)</h2>
          <div className="flex gap-2">
            <input
              id="amenity-add"
              placeholder="Add amenity and press Enter"
              className="flex-1 rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                e.preventDefault();
                const v = e.target.value.trim();
                if (!v) return;
                patch({ amenities: [...form.amenities, v] });
                e.target.value = '';
              }}
            />
          </div>
          <ul className="flex flex-wrap gap-2">
            {form.amenities.map((a, i) => (
              <li
                key={`${a}-${i}`}
                className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-sm dark:bg-neutral-800"
              >
                {a}
                <button type="button" className="text-red-600" onClick={() => patch({ amenities: form.amenities.filter((_, j) => j !== i) })}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        </section>

        <SectionBreakImagesEditor
          sectionKey="amenities"
          title="Amenities list"
          subtitle="Shown after the amenities bullet list."
          images={form.sectionBreakImages.amenities}
          onChange={(next) =>
            patch({ sectionBreakImages: { ...form.sectionBreakImages, amenities: next } })
          }
          uploadFile={uploadFile}
          isUploading={isUploading}
          setUploadingKey={setUploadingKey}
        />

        <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold heading-dlf text-gold">Amenity Gallery</h2>
              <p className="text-xs text-neutral-500">Upload images — each file is sent to Cloudinary; add optional captions.</p>
            </div>
            <button
              type="button"
              className="text-xs text-gold hover:underline"
              onClick={() => patch({ amenityImages: [...form.amenityImages, emptyImg()] })}
            >
              Add image
            </button>
          </div>
          {form.amenityImages.map((img, i) => (
            <div
              key={`amenity-${i}`}
              className="flex flex-col gap-3 rounded-xl border border-neutral-100 p-3 dark:border-neutral-800 sm:flex-row sm:items-start"
            >
              <div className="flex shrink-0 gap-2">
                {img.src ? (
                  <img
                    src={img.src}
                    alt=""
                    className="h-24 w-32 rounded-lg border border-neutral-200 object-cover dark:border-neutral-700"
                  />
                ) : (
                  <div className="flex h-24 w-32 items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 text-xs text-neutral-500 dark:border-neutral-600 dark:bg-neutral-900">
                    No image
                  </div>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id={`amenity-upload-${i}`}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    e.target.value = '';
                    if (!file) return;
                    setUploadingKey(`amenity-${i}`);
                    try {
                      const url = await uploadFile(file);
                      if (url) {
                        const amenityImages = [...form.amenityImages];
                        amenityImages[i] = { ...amenityImages[i], src: url };
                        patch({ amenityImages });
                      }
                      toast.success('Uploaded to Cloudinary');
                    } catch (err) {
                      toast.error(err.message);
                    } finally {
                      setUploadingKey(null);
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isUploading(`amenity-${i}`)}
                    onClick={() => document.getElementById(`amenity-upload-${i}`)?.click()}
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs dark:border-neutral-700"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {isUploading(`amenity-${i}`) ? 'Uploading…' : img.src ? 'Replace file' : 'Upload file'}
                  </button>
                </div>
                <label className="block text-xs">
                  Caption / alt
                  <input
                    className="mt-1 w-full rounded-lg border border-neutral-200 px-2 py-1 dark:border-neutral-700 dark:bg-neutral-950"
                    value={img.alt}
                    onChange={(e) => {
                      const amenityImages = [...form.amenityImages];
                      amenityImages[i] = { ...img, alt: e.target.value };
                      patch({ amenityImages });
                    }}
                  />
                </label>
                {img.src ? (
                  <p className="truncate text-[10px] text-neutral-400" title={img.src}>
                    {img.src.includes('cloudinary') ? 'Cloudinary' : 'Saved URL'} · {img.src.slice(-40)}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                className="self-start text-sm text-red-600 sm:ml-auto"
                onClick={() => patch({ amenityImages: form.amenityImages.filter((_, j) => j !== i) })}
              >
                Remove
              </button>
            </div>
          ))}
        </section>

        <SectionBreakImagesEditor
          sectionKey="amenityImages"
          title="Amenity Gallery"
          subtitle="Shown after the Amenity Gallery grid."
          images={form.sectionBreakImages.amenityImages}
          onChange={(next) =>
            patch({ sectionBreakImages: { ...form.sectionBreakImages, amenityImages: next } })
          }
          uploadFile={uploadFile}
          isUploading={isUploading}
          setUploadingKey={setUploadingKey}
        />

        <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-sm font-semibold heading-dlf text-gold">Location &amp; distances</h2>
          <label className="block text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Map search query</span>
            <input
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              value={form.mapQuery}
              onChange={(e) => patch({ mapQuery: e.target.value })}
              placeholder="Bodh Gaya, Bihar, India"
            />
          </label>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Group distances into categories. Use + on a category row to show or hide its sub-places (name + km).
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Nearest to project</span>
            <button
              type="button"
              className="text-xs text-gold hover:underline"
              onClick={() => {
                const ci = (form.nearestCategories || []).length;
                patch({
                  nearestCategories: [...(form.nearestCategories || []), { label: '', places: [] }],
                });
                setNearestCatOpen((m) => ({ ...m, [ci]: true }));
              }}
            >
              Add category
            </button>
          </div>
          {(form.nearestCategories || []).length === 0 ? (
            <p className="text-xs text-neutral-500">No categories yet — add one to list distances by group.</p>
          ) : null}
          {(form.nearestCategories || []).map((cat, ci) => {
            const expanded = nearestCatOpen[ci] ?? false;
            const placeCount = (cat.places || []).filter((pl) => (pl.label || '').trim()).length;
            return (
              <div key={ci} className="rounded-xl border border-neutral-100 p-3 dark:border-neutral-800">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-neutral-200 p-2 dark:border-neutral-700"
                    aria-expanded={expanded}
                    aria-label={expanded ? 'Collapse sub-places' : 'Expand sub-places'}
                    title={expanded ? 'Hide sub-places' : 'Show sub-places'}
                    onClick={() =>
                      setNearestCatOpen((m) => ({ ...m, [ci]: !(m[ci] ?? false) }))
                    }
                  >
                    {expanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </button>
                  <input
                    placeholder="Category (Education, Healthcare…)"
                    className="min-w-[12rem] flex-1 rounded-lg border border-neutral-200 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                    value={cat.label}
                    onChange={(e) => {
                      const nearestCategories = [...form.nearestCategories];
                      nearestCategories[ci] = { ...cat, label: e.target.value };
                      patch({ nearestCategories });
                    }}
                  />
                  <button
                    type="button"
                    className="ml-auto text-red-600"
                    aria-label={`Remove category ${ci + 1}`}
                    onClick={() => {
                      patch({
                        nearestCategories: form.nearestCategories.filter((_, j) => j !== ci),
                      });
                      setNearestCatOpen({});
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {!expanded ? (
                  <p className="mt-2 text-xs text-neutral-500">
                    {placeCount} place{placeCount === 1 ? '' : 's'} — click + to edit
                  </p>
                ) : (
                  <div className="mt-4 space-y-2 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">Sub-places (km)</span>
                      <button
                        type="button"
                        className="text-xs text-gold hover:underline"
                        onClick={() => {
                          const nearestCategories = [...form.nearestCategories];
                          nearestCategories[ci] = {
                            ...cat,
                            places: [...(cat.places || []), emptyNear()],
                          };
                          patch({ nearestCategories });
                        }}
                      >
                        Add place
                      </button>
                    </div>
                    {(cat.places || []).length === 0 ? (
                      <p className="text-xs text-neutral-500">No places in this category yet.</p>
                    ) : null}
                    {(cat.places || []).map((n, pi) => (
                      <div key={pi} className="flex flex-wrap gap-2">
                        <input
                          placeholder="Landmark name"
                          className="min-w-[10rem] flex-1 rounded-lg border border-neutral-200 px-2 py-1 dark:border-neutral-700 dark:bg-neutral-950"
                          value={n.label}
                          onChange={(e) => {
                            const nearestCategories = [...form.nearestCategories];
                            const places = [...(cat.places || [])];
                            places[pi] = { ...n, label: e.target.value };
                            nearestCategories[ci] = { ...cat, places };
                            patch({ nearestCategories });
                          }}
                        />
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="km"
                          className="w-24 rounded-lg border border-neutral-200 px-2 py-1 dark:border-neutral-700 dark:bg-neutral-950"
                          value={n.distanceKm}
                          onChange={(e) => {
                            const nearestCategories = [...form.nearestCategories];
                            const places = [...(cat.places || [])];
                            places[pi] = { ...n, distanceKm: e.target.value };
                            nearestCategories[ci] = { ...cat, places };
                            patch({ nearestCategories });
                          }}
                        />
                        <button
                          type="button"
                          className="text-red-600"
                          aria-label="Remove place"
                          onClick={() => {
                            const nearestCategories = [...form.nearestCategories];
                            nearestCategories[ci] = {
                              ...cat,
                              places: (cat.places || []).filter((_, j) => j !== pi),
                            };
                            patch({ nearestCategories });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        <SectionBreakImagesEditor
          sectionKey="location"
          title="Map & nearest places"
          subtitle="Shown after the location / distances block."
          images={form.sectionBreakImages.location}
          onChange={(next) =>
            patch({ sectionBreakImages: { ...form.sectionBreakImages, location: next } })
          }
          uploadFile={uploadFile}
          isUploading={isUploading}
          setUploadingKey={setUploadingKey}
        />

        <SectionBreakImagesEditor
          sectionKey="inquiry"
          title="Book a site visit"
          subtitle="Shown after the site visit form, before Other developments (when that row exists)."
          images={form.sectionBreakImages.inquiry}
          onChange={(next) =>
            patch({ sectionBreakImages: { ...form.sectionBreakImages, inquiry: next } })
          }
          uploadFile={uploadFile}
          isUploading={isUploading}
          setUploadingKey={setUploadingKey}
        />

        <section className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <div>
            <h2 className="text-sm font-semibold heading-dlf text-gold">Page section colors</h2>
            <p className="mt-1 text-xs text-neutral-500">
              Optional background and text color for each full-width block on the public project page. Hex or use the
              pickers. Clear removes custom colors for that section.
            </p>
          </div>
          <div className="space-y-4">
            {SITE_PROJECT_SECTION_THEMES.map(({ key, label }) => (
              <div
                key={key}
                className="flex flex-col gap-3 rounded-xl border border-neutral-100 p-4 dark:border-neutral-800 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between"
              >
                <p className="min-w-[10rem] text-sm font-medium text-neutral-800 dark:text-neutral-200">{label}</p>
                <div className="flex flex-wrap items-end gap-4">
                  <label className="flex flex-col gap-1 text-[10px] font-medium uppercase tracking-wide text-neutral-500">
                    Background
                    <span className="flex flex-wrap items-center gap-2">
                      <input
                        type="color"
                        value={
                          /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(form.sectionThemes[key]?.bg || '')
                            ? form.sectionThemes[key].bg
                            : '#ffffff'
                        }
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            sectionThemes: {
                              ...f.sectionThemes,
                              [key]: { ...f.sectionThemes[key], bg: e.target.value },
                            },
                          }))
                        }
                        className="h-9 w-14 cursor-pointer rounded border border-neutral-200 dark:border-neutral-700"
                      />
                      <input
                        type="text"
                        placeholder="#1a1a1a"
                        className="w-32 rounded border border-neutral-200 px-2 py-1.5 font-mono text-xs dark:border-neutral-700 dark:bg-neutral-950"
                        value={form.sectionThemes[key]?.bg || ''}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            sectionThemes: {
                              ...f.sectionThemes,
                              [key]: { ...f.sectionThemes[key], bg: e.target.value },
                            },
                          }))
                        }
                      />
                    </span>
                  </label>
                  <label className="flex flex-col gap-1 text-[10px] font-medium uppercase tracking-wide text-neutral-500">
                    Text
                    <span className="flex flex-wrap items-center gap-2">
                      <input
                        type="color"
                        value={
                          /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(form.sectionThemes[key]?.text || '')
                            ? form.sectionThemes[key].text
                            : '#111111'
                        }
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            sectionThemes: {
                              ...f.sectionThemes,
                              [key]: { ...f.sectionThemes[key], text: e.target.value },
                            },
                          }))
                        }
                        className="h-9 w-14 cursor-pointer rounded border border-neutral-200 dark:border-neutral-700"
                      />
                      <input
                        type="text"
                        placeholder="#f5f0e8"
                        className="w-32 rounded border border-neutral-200 px-2 py-1.5 font-mono text-xs dark:border-neutral-700 dark:bg-neutral-950"
                        value={form.sectionThemes[key]?.text || ''}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            sectionThemes: {
                              ...f.sectionThemes,
                              [key]: { ...f.sectionThemes[key], text: e.target.value },
                            },
                          }))
                        }
                      />
                    </span>
                  </label>
                  <button
                    type="button"
                    className="rounded-lg px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        sectionThemes: {
                          ...f.sectionThemes,
                          [key]: { bg: '', text: '' },
                        },
                      }))
                    }
                  >
                    Clear
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <SectionBreakImagesEditor
          sectionKey="otherDevelopments"
          title="Other developments"
          subtitle="Shown at the very end of the page, after the related projects row."
          images={form.sectionBreakImages.otherDevelopments}
          onChange={(next) =>
            patch({ sectionBreakImages: { ...form.sectionBreakImages, otherDevelopments: next } })
          }
          uploadFile={uploadFile}
          isUploading={isUploading}
          setUploadingKey={setUploadingKey}
        />

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-navy disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save project'}
          </button>
          {!isNew && (
            <button type="button" className="rounded-full border border-red-200 px-6 py-2.5 text-sm text-red-600" onClick={removeProject}>
              Delete project
            </button>
          )}
        </div>
      </form>
    </>
  );
}
