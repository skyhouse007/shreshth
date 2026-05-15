import mongoose from 'mongoose';

const announcementEntrySchema = new mongoose.Schema(
  {
    text: { type: String, trim: true, maxlength: 500 },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const heroSlideSchema = new mongoose.Schema(
  {
    src: { type: String, trim: true, maxlength: 2048 },
    alt: { type: String, trim: true, maxlength: 500 },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const siteSettingsSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, default: 'global', unique: true },
    announcements: { type: [announcementEntrySchema], default: [] },
    heroSlides: { type: [heroSlideSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);
