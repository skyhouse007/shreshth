import mongoose from 'mongoose';
import ContactMessage from '../models/ContactMessage.js';

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      const err = new Error('Name, email and message are required');
      err.statusCode = 400;
      return next(err);
    }
    const doc = await ContactMessage.create({ name, email, phone: phone || '', message });
    res.status(201).json(doc);
  } catch (e) {
    next(e);
  }
};

export const listContacts = async (req, res, next) => {
  try {
    const items = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (e) {
    next(e);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error('Invalid id');
      err.statusCode = 400;
      return next(err);
    }
    const doc = await ContactMessage.findById(req.params.id);
    if (!doc) {
      const err = new Error('Not found');
      err.statusCode = 404;
      return next(err);
    }
    if (req.body.read !== undefined) doc.read = Boolean(req.body.read);
    await doc.save();
    res.json(doc);
  } catch (e) {
    next(e);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error('Invalid id');
      err.statusCode = 400;
      return next(err);
    }
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    next(e);
  }
};
