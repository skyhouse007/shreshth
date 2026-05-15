import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    src: { type: String, required: true, trim: true },
    alt: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const flatTypeSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    superBuiltUpSqft: { type: Number, default: null, min: 0 },
    carpetSqft: { type: Number, default: null, min: 0 },
  },
  { _id: false }
);

const nearestPlaceSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    distanceKm: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

/** Distance list grouped under a heading (legacy flat list lives on `nearestPlaces`). */
const nearestCategorySchema = new mongoose.Schema(
  {
    label: { type: String, default: '', trim: true },
    places: { type: [nearestPlaceSchema], default: [] },
  },
  { _id: false }
);

const statusVariants = ['violet', 'emerald', 'amber', 'rose', 'neutral'];

const siteProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    headline: { type: String, default: '', trim: true },
    shortLabel: { type: String, default: '', trim: true },
    statusLabel: { type: String, default: 'Upcoming', trim: true },
    statusVariant: { type: String, enum: statusVariants, default: 'violet' },
    coverImage: { type: String, default: '', trim: true },
    about: { type: String, default: '' },
    openSpace: { type: String, default: '' },
    totalProjectArea: { type: String, default: '', trim: true },
    totalTowers: { type: Number, default: null, min: 0 },
    floorsAboveGround: { type: Number, default: null, min: 0 },
    flatTypes: { type: [flatTypeSchema], default: [] },
    amenities: [{ type: String, trim: true }],
    amenityImages: { type: [imageSchema], default: [] },
    gallery: { type: [imageSchema], default: [] },
    mapQuery: { type: String, default: '', trim: true },
    nearestPlaces: { type: [nearestPlaceSchema], default: [] },
    nearestCategories: { type: [nearestCategorySchema], default: [] },
    /** Per-section UI: { intro: { bg, text }, residences: {...}, ... } — hex / css colors */
    sectionThemes: { type: mongoose.Schema.Types.Mixed, default: {} },
    /**
     * Extra images after each page block. Keys: hero, intro, projectOverview, …
     * Values: { src, alt }[] — normalized in controller.
     */
    sectionBreakImages: { type: mongoose.Schema.Types.Mixed, default: {} },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

siteProjectSchema.index({ published: 1, sortOrder: 1, createdAt: -1 });

export default mongoose.model('SiteProject', siteProjectSchema);
export { statusVariants };
