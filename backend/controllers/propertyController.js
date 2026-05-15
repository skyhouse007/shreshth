import mongoose from 'mongoose';
import Property from '../models/Property.js';
import { slugify } from '../utils/slugify.js';
import { uploadBuffer } from '../config/cloudinary.js';

function parseArrayField(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : value.split(',').map((s) => s.trim()).filter(Boolean);
    } catch {
      return value.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

async function uploadFiles(files) {
  if (!files?.length) return [];
  const urls = [];
  for (const file of files) {
    const result = await uploadBuffer(file.buffer);
    urls.push(result.secure_url);
  }
  return urls;
}

export const getProperties = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(24, Math.max(1, parseInt(req.query.limit, 10) || 9));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.purpose) filter.purpose = req.query.purpose;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.city) filter.city = new RegExp(req.query.city, 'i');
    if (req.query.location) {
      filter.$or = [
        { location: new RegExp(req.query.location, 'i') },
        { city: new RegExp(req.query.location, 'i') },
      ];
    }
    if (req.query.minPrice) filter.price = { ...filter.price, $gte: Number(req.query.minPrice) };
    if (req.query.maxPrice) {
      filter.price = { ...filter.price, $lte: Number(req.query.maxPrice) };
    }
    if (req.query.featured === 'true') filter.featured = true;

    const [items, total] = await Promise.all([
      Property.find(filter).sort({ featured: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Property.countDocuments(filter),
    ]);

    res.json({
      items,
      page,
      pages: Math.ceil(total / limit) || 1,
      total,
    });
  } catch (e) {
    next(e);
  }
};

export const getPropertiesByIds = async (req, res, next) => {
  try {
    const raw = String(req.query.ids || '');
    const ids = raw
      .split(',')
      .map((s) => s.trim())
      .filter((id) => mongoose.isValidObjectId(id))
      .slice(0, 5);
    if (!ids.length) {
      res.json([]);
      return;
    }
    const items = await Property.find({ _id: { $in: ids } }).lean();
    const order = new Map(ids.map((id, i) => [id, i]));
    items.sort((a, b) => (order.get(String(a._id)) ?? 0) - (order.get(String(b._id)) ?? 0));
    res.json(items);
  } catch (e) {
    next(e);
  }
};

export const getPropertyBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const property = await Property.findOne({ slug }).lean();
    if (!property) {
      const err = new Error('Property not found');
      err.statusCode = 404;
      return next(err);
    }
    const related = await Property.find({
      _id: { $ne: property._id },
      city: property.city,
      purpose: property.purpose,
    })
      .limit(4)
      .lean();
    res.json({ property, related });
  } catch (e) {
    next(e);
  }
};

export const getPropertyByIdAdmin = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error('Invalid id');
      err.statusCode = 400;
      return next(err);
    }
    const property = await Property.findById(req.params.id).lean();
    if (!property) {
      const err = new Error('Property not found');
      err.statusCode = 404;
      return next(err);
    }
    res.json(property);
  } catch (e) {
    next(e);
  }
};

export const createProperty = async (req, res, next) => {
  try {
    const body = req.body;
    let slug = body.slug ? slugify(body.slug) : slugify(body.title || '');
    const uniqueBase = slug || 'property';
    let candidate = uniqueBase;
    let n = 1;
    while (await Property.exists({ slug: candidate })) {
      candidate = `${uniqueBase}-${n++}`;
    }
    slug = candidate;

    const imageUrls = await uploadFiles(req.files);

    const property = await Property.create({
      title: body.title,
      slug,
      description: body.description,
      location: body.location,
      city: body.city,
      state: body.state,
      type: body.type,
      purpose: body.purpose,
      bedrooms: Number(body.bedrooms) || 0,
      bathrooms: Number(body.bathrooms) || 0,
      area: Number(body.area),
      price: Number(body.price),
      amenities: parseArrayField(body.amenities),
      images: imageUrls,
      featured: body.featured === true || body.featured === 'true',
      status: body.status || 'active',
    });

    res.status(201).json(property);
  } catch (e) {
    next(e);
  }
};

export const updateProperty = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error('Invalid id');
      err.statusCode = 400;
      return next(err);
    }
    const property = await Property.findById(req.params.id);
    if (!property) {
      const err = new Error('Property not found');
      err.statusCode = 404;
      return next(err);
    }

    const body = req.body;
    const fields = [
      'title',
      'description',
      'location',
      'city',
      'state',
      'type',
      'purpose',
      'bedrooms',
      'bathrooms',
      'area',
      'price',
      'featured',
      'status',
    ];
    for (const f of fields) {
      if (body[f] !== undefined) {
        if (f === 'bedrooms' || f === 'bathrooms' || f === 'area' || f === 'price') {
          property[f] = Number(body[f]);
        } else if (f === 'featured') {
          property.featured = body[f] === true || body[f] === 'true';
        } else {
          property[f] = body[f];
        }
      }
    }
    if (body.slug) property.slug = slugify(body.slug);
    if (body.amenities !== undefined) property.amenities = parseArrayField(body.amenities);

    const conflict = await Property.findOne({ slug: property.slug, _id: { $ne: property._id } });
    if (conflict) {
      property.slug = `${property.slug}-${Date.now()}`;
    }

    if (req.files?.length) {
      const newUrls = await uploadFiles(req.files);
      if (body.replaceImages === 'true' || body.replaceImages === true) {
        property.images = newUrls;
      } else {
        property.images = [...property.images, ...newUrls];
      }
    }

    await property.save();
    res.json(property);
  } catch (e) {
    next(e);
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error('Invalid id');
      err.statusCode = 400;
      return next(err);
    }
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    next(e);
  }
};
