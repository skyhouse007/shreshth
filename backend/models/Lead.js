import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, default: '', trim: true },
    source: { type: String, trim: true, default: '', maxlength: 120 },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', default: null },
    propertyTitle: { type: String, trim: true, default: '' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

leadSchema.index({ createdAt: -1 });

export default mongoose.model('Lead', leadSchema);
