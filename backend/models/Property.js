import mongoose from 'mongoose';

const propertyTypes = ['apartment', 'villa', 'plot'];
const purposes = ['sale', 'rent'];

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    type: { type: String, enum: propertyTypes, required: true },
    purpose: { type: String, enum: purposes, required: true },
    bedrooms: { type: Number, default: 0, min: 0 },
    bathrooms: { type: Number, default: 0, min: 0 },
    area: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    amenities: [{ type: String, trim: true }],
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['active', 'pending', 'sold', 'rented'],
      default: 'active',
    },
  },
  { timestamps: true }
);

propertySchema.index({ city: 1, purpose: 1, type: 1, price: 1 });
propertySchema.index({ featured: -1, createdAt: -1 });

export default mongoose.model('Property', propertySchema);
export { propertyTypes, purposes };
