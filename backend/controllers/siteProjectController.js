import SiteProject, { statusVariants } from '../models/SiteProject.js';
import { uploadBuffer, cloudinaryFolders } from '../config/cloudinary.js';

const SECTION_THEME_KEYS = new Set([
  'hero',
  'intro',
  'projectOverview',
  'residences',
  'amenities',
  'amenityImages',
  'location',
  'inquiry',
  'otherDevelopments',
]);

function sanitizeCssColor(s) {
  if (typeof s !== 'string') return '';
  const t = s.trim().slice(0, 80);
  if (!t) return '';
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(t)) return t;
  if (/^(rgb|hsl)a?\(/i.test(t)) return t;
  if (t === 'transparent') return t;
  return '';
}

function normalizeSectionThemes(raw) {
  if (!raw || typeof raw !== 'object') return {};
  const out = {};
  for (const key of SECTION_THEME_KEYS) {
    if (!raw[key] || typeof raw[key] !== 'object') continue;
    const bg = sanitizeCssColor(raw[key].bg);
    const text = sanitizeCssColor(raw[key].text);
    if (bg || text) out[key] = { bg, text };
  }
  return out;
}

const MAX = {
  amenities: 50,
  amenityImages: 24,
  gallery: 40,
  flatTypes: 24,
  nearest: 40,
  nearestCategories: 30,
  nearestPlacesPerCategory: 50,
  nearestPlacesTotal: 200,
  sectionBreakImagesPerSection: 12,
};

const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120) || 'project';

async function uniqueSlug(base) {
  let slug = slugify(base);
  let n = 0;
  for (;;) {
    const candidate = n ? `${slug}-${n}` : slug;
    const exists = await SiteProject.findOne({ slug: candidate }).select('_id').lean();
    if (!exists) return candidate;
    n += 1;
  }
}

const trimStrings = (arr, max) =>
  (Array.isArray(arr) ? arr : [])
    .map((x) => (typeof x === 'string' ? x.trim().slice(0, 800) : ''))
    .filter(Boolean)
    .slice(0, max);

const normalizeImages = (arr, max) =>
  (Array.isArray(arr) ? arr : [])
    .map((item) => {
      const src = typeof item?.src === 'string' ? item.src.trim().slice(0, 2048) : '';
      const alt = typeof item?.alt === 'string' ? item.alt.trim().slice(0, 500) : '';
      return src ? { src, alt } : null;
    })
    .filter(Boolean)
    .slice(0, max);

const normalizeFlatTypes = (arr) =>
  (Array.isArray(arr) ? arr : [])
    .map((item) => {
      const label = typeof item?.label === 'string' ? item.label.trim().slice(0, 120) : '';
      if (!label) return null;
      const superBuilt =
        typeof item.superBuiltUpSqft === 'number' && item.superBuiltUpSqft >= 0
          ? item.superBuiltUpSqft
          : item.superBuiltUpSqft !== undefined && item.superBuiltUpSqft !== null && item.superBuiltUpSqft !== ''
            ? Number(item.superBuiltUpSqft)
            : null;
      const carpet =
        typeof item.carpetSqft === 'number' && item.carpetSqft >= 0
          ? item.carpetSqft
          : item.carpetSqft !== undefined && item.carpetSqft !== null && item.carpetSqft !== ''
            ? Number(item.carpetSqft)
            : null;
      return {
        label,
        superBuiltUpSqft: Number.isFinite(superBuilt) ? superBuilt : null,
        carpetSqft: Number.isFinite(carpet) ? carpet : null,
      };
    })
    .filter(Boolean)
    .slice(0, MAX.flatTypes);

const normalizeNearest = (arr, cap = MAX.nearest) =>
  (Array.isArray(arr) ? arr : [])
    .map((item) => {
      const label = typeof item?.label === 'string' ? item.label.trim().slice(0, 200) : '';
      const km =
        typeof item.distanceKm === 'number' ? item.distanceKm : Number(item?.distanceKm);
      if (!label || !Number.isFinite(km) || km < 0) return null;
      return { label, distanceKm: km };
    })
    .filter(Boolean)
    .slice(0, cap);

function normalizeNearestCategoriesFromBody(body) {
  if (!Array.isArray(body.nearestCategories)) {
    const flat = normalizeNearest(body.nearestPlaces || [], MAX.nearestPlacesTotal);
    if (!flat.length) return [];
    return [{ label: '', places: flat }];
  }

  let globalCount = 0;
  const out = [];
  for (const cat of body.nearestCategories.slice(0, MAX.nearestCategories)) {
    const catLabel =
      typeof cat?.label === 'string' ? cat.label.trim().slice(0, 120) : '';
    const rawPlaces = Array.isArray(cat?.places) ? cat.places : [];
    const capped = normalizeNearest(rawPlaces, MAX.nearestPlacesPerCategory);
    const places = [];
    for (const p of capped) {
      if (globalCount >= MAX.nearestPlacesTotal) break;
      places.push(p);
      globalCount += 1;
    }
    if (!catLabel && !places.length) continue;
    out.push({ label: catLabel, places });
    if (globalCount >= MAX.nearestPlacesTotal) break;
  }
  return out;
}

function deriveNearestCategoriesFromDoc(o) {
  const grouped = Array.isArray(o.nearestCategories) ? o.nearestCategories : [];
  const sanitized = grouped
    .map((c) => ({
      label: typeof c?.label === 'string' ? c.label.trim() : '',
      places: Array.isArray(c.places)
        ? c.places
            .map((item) => {
              const label = typeof item?.label === 'string' ? item.label.trim() : '';
              const km =
                typeof item.distanceKm === 'number' ? item.distanceKm : Number(item?.distanceKm);
              if (!label || !Number.isFinite(km) || km < 0) return null;
              return { label, distanceKm: km };
            })
            .filter(Boolean)
        : [],
    }))
    .filter((c) => (c.label && c.label.length > 0) || c.places.length > 0);

  if (sanitized.length) return sanitized;

  const flat = normalizeNearest(Array.isArray(o.nearestPlaces) ? o.nearestPlaces : []);
  if (!flat.length) return [];
  return [{ label: '', places: flat }];
}

function flattenNearestCategories(nearestCategories) {
  const out = [];
  for (const c of nearestCategories || []) {
    for (const p of c.places || []) out.push(p);
  }
  return out;
}

function normalizeOptionalNonNegInt(raw) {
  if (raw === '' || raw === undefined || raw === null) return null;
  const n = typeof raw === 'number' ? raw : Number(raw);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.floor(n);
}

function normalizeSectionBreakImages(raw) {
  if (!raw || typeof raw !== 'object') return {};
  const out = {};
  for (const key of SECTION_THEME_KEYS) {
    const imgs = normalizeImages(raw[key], MAX.sectionBreakImagesPerSection);
    if (imgs.length) out[key] = imgs;
  }
  return out;
}

function sectionBreakImagesForPublic(raw) {
  if (!raw || typeof raw !== 'object') return {};
  const out = {};
  for (const key of SECTION_THEME_KEYS) {
    const arr = Array.isArray(raw[key]) ? raw[key] : [];
    const imgs = arr
      .map((item) => {
        const src = typeof item?.src === 'string' ? item.src.trim() : '';
        const alt = typeof item?.alt === 'string' ? item.alt.trim() : '';
        return src ? { src, alt } : null;
      })
      .filter(Boolean);
    if (imgs.length) out[key] = imgs;
  }
  return out;
}

function normalizePayload(body, { existingSlug = null } = {}) {
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 300) : '';
  if (!name) {
    const err = new Error('Project name is required');
    err.statusCode = 400;
    throw err;
  }

  const rawSlug = typeof body.slug === 'string' ? body.slug.trim().slice(0, 140) : '';
  let slug;
  if (rawSlug) slug = slugify(rawSlug);
  else if (existingSlug) slug = existingSlug;
  else slug = slugify(name);

  const statusVariant = statusVariants.includes(body.statusVariant)
    ? body.statusVariant
    : 'violet';

  return {
    name,
    slug,
    headline: typeof body.headline === 'string' ? body.headline.trim().slice(0, 500) : '',
    shortLabel: typeof body.shortLabel === 'string' ? body.shortLabel.trim().slice(0, 200) : '',
    statusLabel:
      typeof body.statusLabel === 'string' ? body.statusLabel.trim().slice(0, 80) : 'Upcoming',
    statusVariant,
    coverImage:
      typeof body.coverImage === 'string' ? body.coverImage.trim().slice(0, 2048) : '',
    about: typeof body.about === 'string' ? body.about.trim().slice(0, 20000) : '',
    openSpace: typeof body.openSpace === 'string' ? body.openSpace.trim().slice(0, 10000) : '',
    totalProjectArea:
      typeof body.totalProjectArea === 'string' ? body.totalProjectArea.trim().slice(0, 300) : '',
    totalTowers: normalizeOptionalNonNegInt(body.totalTowers),
    floorsAboveGround: normalizeOptionalNonNegInt(body.floorsAboveGround),
    flatTypes: normalizeFlatTypes(body.flatTypes),
    amenities: trimStrings(body.amenities, MAX.amenities),
    amenityImages: normalizeImages(body.amenityImages, MAX.amenityImages),
    gallery: normalizeImages(body.gallery, MAX.gallery),
    mapQuery: typeof body.mapQuery === 'string' ? body.mapQuery.trim().slice(0, 500) : '',
    nearestCategories: normalizeNearestCategoriesFromBody(body),
    nearestPlaces: [],
    sectionBreakImages: normalizeSectionBreakImages(body.sectionBreakImages),
    sectionThemes: normalizeSectionThemes(body.sectionThemes),
    sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
    published: body.published !== false,
  };
}

const toPublic = (doc) => {
  if (!doc) return null;
  const o = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  const nearestCategories = deriveNearestCategoriesFromDoc(o);
  const nearestPlaces = flattenNearestCategories(nearestCategories);
  return {
    id: String(o._id),
    name: o.name,
    slug: o.slug,
    headline: o.headline,
    shortLabel: o.shortLabel,
    statusLabel: o.statusLabel,
    statusVariant: o.statusVariant,
    coverImage: o.coverImage,
    about: o.about,
    openSpace: o.openSpace,
    totalProjectArea: o.totalProjectArea || '',
    totalTowers:
      typeof o.totalTowers === 'number' && Number.isFinite(o.totalTowers) ? o.totalTowers : null,
    floorsAboveGround:
      typeof o.floorsAboveGround === 'number' && Number.isFinite(o.floorsAboveGround) ?
        o.floorsAboveGround
      : null,
    flatTypes: o.flatTypes || [],
    amenities: o.amenities || [],
    amenityImages: o.amenityImages || [],
    gallery: o.gallery || [],
    mapQuery: o.mapQuery,
    nearestCategories,
    nearestPlaces,
    sectionBreakImages: sectionBreakImagesForPublic(o.sectionBreakImages),
    sectionThemes: o.sectionThemes && typeof o.sectionThemes === 'object' ? o.sectionThemes : {},
    sortOrder: o.sortOrder ?? 0,
    published: o.published !== false,
    updatedAt: o.updatedAt,
    createdAt: o.createdAt,
  };
};

export const listSiteProjectsPublic = async (req, res, next) => {
  try {
    const docs = await SiteProject.find({ published: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .select(
        'name slug headline shortLabel statusLabel statusVariant coverImage sortOrder updatedAt published'
      )
      .lean();
    res.json({ items: docs.map((d) => toPublic({ ...d, _id: d._id })) });
  } catch (e) {
    next(e);
  }
};

export const getSiteProjectBySlugPublic = async (req, res, next) => {
  try {
    const slug = String(req.params.slug || '')
      .toLowerCase()
      .trim();
    const doc = await SiteProject.findOne({ slug, published: true }).lean();
    if (!doc) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    res.json({ project: toPublic({ ...doc, _id: doc._id }) });
  } catch (e) {
    next(e);
  }
};

/** Admin: GET all */
export const listSiteProjectsAdmin = async (req, res, next) => {
  try {
    const docs = await SiteProject.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    res.json({ items: docs.map((d) => toPublic({ ...d, _id: d._id })) });
  } catch (e) {
    next(e);
  }
};

export const getSiteProjectAdmin = async (req, res, next) => {
  try {
    const doc = await SiteProject.findById(req.params.id).lean();
    if (!doc) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    res.json({ project: toPublic({ ...doc, _id: doc._id }) });
  } catch (e) {
    next(e);
  }
};

export const createSiteProjectAdmin = async (req, res, next) => {
  try {
    const payload = normalizePayload(req.body);
    payload.slug = await uniqueSlug(slugify(payload.slug));
    const doc = await SiteProject.create(payload);
    res.status(201).json({ project: toPublic(doc) });
  } catch (e) {
    if (e.code === 11000) {
      const err = new Error('Slug already exists');
      err.statusCode = 400;
      return next(err);
    }
    next(e);
  }
};

export const updateSiteProjectAdmin = async (req, res, next) => {
  try {
    const cur = await SiteProject.findById(req.params.id);
    if (!cur) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    const payload = normalizePayload(req.body, { existingSlug: cur.slug });
    let slug = slugify(payload.slug || cur.slug);
    if (slug !== cur.slug) {
      const other = await SiteProject.findOne({ slug, _id: { $ne: cur._id } }).select('_id').lean();
      if (other) slug = await uniqueSlug(slug);
    }

    const { sectionThemes, sectionBreakImages, ...payloadRest } = payload;
    Object.assign(cur, { ...payloadRest, slug });
    // Mixed: replace with a plain snapshot (Object.assign can leave nested change tracking stale).
    cur.sectionThemes = JSON.parse(JSON.stringify(sectionThemes ?? {}));
    cur.sectionBreakImages = JSON.parse(JSON.stringify(sectionBreakImages ?? {}));
    cur.markModified('sectionThemes');
    cur.markModified('sectionBreakImages');
    await cur.save();
    res.json({ project: toPublic(cur) });
  } catch (e) {
    next(e);
  }
};

export const deleteSiteProjectAdmin = async (req, res, next) => {
  try {
    const r = await SiteProject.findByIdAndDelete(req.params.id);
    if (!r) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
};

export const uploadSiteProjectImageAdmin = async (req, res, next) => {
  try {
    if (!req.file?.buffer) {
      const err = new Error('No image file');
      err.statusCode = 400;
      return next(err);
    }
    const result = await uploadBuffer(req.file.buffer, cloudinaryFolders.siteProjects);
    res.json({ url: result.secure_url });
  } catch (e) {
    next(e);
  }
};
