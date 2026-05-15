import SiteSettings from '../models/SiteSettings.js';
import { uploadBuffer, cloudinaryFolders } from '../config/cloudinary.js';

const SINGLETON_KEY = 'global';
const MAX_ANNOUNCEMENTS = 30;
const MAX_HERO_SLIDES = 12;

export const getPublicHeroSlides = async (req, res, next) => {
  try {
    const doc = await SiteSettings.findOne({ singletonKey: SINGLETON_KEY }).lean();
    const slides = (doc?.heroSlides || [])
      .filter((s) => s.enabled !== false && typeof s.src === 'string' && s.src.trim().length > 0)
      .map((s) => ({
        src: s.src.trim(),
        alt: typeof s.alt === 'string' ? s.alt.trim().slice(0, 500) : '',
      }));
    res.json({ slides });
  } catch (e) {
    next(e);
  }
};

export const uploadHeroSlideAdmin = async (req, res, next) => {
  try {
    if (!req.file?.buffer) {
      const err = new Error('No image file');
      err.statusCode = 400;
      return next(err);
    }
    const result = await uploadBuffer(req.file.buffer, cloudinaryFolders.hero);
    res.json({ url: result.secure_url });
  } catch (e) {
    next(e);
  }
};

export const getPublicAnnouncements = async (req, res, next) => {
  try {
    const doc = await SiteSettings.findOne({ singletonKey: SINGLETON_KEY }).lean();
    const list = (doc?.announcements || [])
      .filter((a) => a.enabled !== false && typeof a.text === 'string' && a.text.trim().length > 0)
      .map((a) => a.text.trim());
    res.json({ announcements: list });
  } catch (e) {
    next(e);
  }
};

export const getSiteSettingsAdmin = async (req, res, next) => {
  try {
    let doc = await SiteSettings.findOne({ singletonKey: SINGLETON_KEY }).lean();
    if (!doc) {
      doc = { announcements: [], heroSlides: [] };
    }
    res.json({
      announcements: (doc.announcements || []).map((a) => ({
        text: a.text || '',
        enabled: a.enabled !== false,
      })),
      heroSlides: (doc.heroSlides || []).map((s) => ({
        src: typeof s.src === 'string' ? s.src : '',
        alt: typeof s.alt === 'string' ? s.alt : '',
        enabled: s.enabled !== false,
      })),
    });
  } catch (e) {
    next(e);
  }
};

export const updateAnnouncementsAdmin = async (req, res, next) => {
  try {
    const raw = req.body?.announcements;
    if (!Array.isArray(raw)) {
      const err = new Error('announcements must be an array');
      err.statusCode = 400;
      return next(err);
    }
    if (raw.length > MAX_ANNOUNCEMENTS) {
      const err = new Error(`At most ${MAX_ANNOUNCEMENTS} announcements allowed`);
      err.statusCode = 400;
      return next(err);
    }
    const announcements = raw
      .map((item) => {
        const text = typeof item?.text === 'string' ? item.text.trim().slice(0, 500) : '';
        const enabled = item?.enabled !== false;
        return { text, enabled };
      })
      .filter((a) => a.text.length > 0);
    const updated = await SiteSettings.findOneAndUpdate(
      { singletonKey: SINGLETON_KEY },
      { $set: { announcements } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    res.json({
      announcements: (updated.announcements || []).map((a) => ({
        text: a.text || '',
        enabled: a.enabled !== false,
      })),
    });
  } catch (e) {
    next(e);
  }
};

export const updateHeroSlidesAdmin = async (req, res, next) => {
  try {
    const raw = req.body?.heroSlides;
    if (!Array.isArray(raw)) {
      const err = new Error('heroSlides must be an array');
      err.statusCode = 400;
      return next(err);
    }
    if (raw.length > MAX_HERO_SLIDES) {
      const err = new Error(`At most ${MAX_HERO_SLIDES} hero slides allowed`);
      err.statusCode = 400;
      return next(err);
    }
    const heroSlides = raw
      .map((item) => {
        const src = typeof item?.src === 'string' ? item.src.trim().slice(0, 2048) : '';
        const alt = typeof item?.alt === 'string' ? item.alt.trim().slice(0, 500) : '';
        const enabled = item?.enabled !== false;
        return { src, alt, enabled };
      })
      .filter((s) => s.src.length > 0);
    const updated = await SiteSettings.findOneAndUpdate(
      { singletonKey: SINGLETON_KEY },
      { $set: { heroSlides } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    res.json({
      heroSlides: (updated.heroSlides || []).map((s) => ({
        src: s.src || '',
        alt: s.alt || '',
        enabled: s.enabled !== false,
      })),
    });
  } catch (e) {
    next(e);
  }
};
