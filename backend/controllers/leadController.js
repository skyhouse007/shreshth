import mongoose from 'mongoose';
import Lead from '../models/Lead.js';
import Property from '../models/Property.js';
import { sendInquiryEmail } from '../utils/email.js';

export const createLead = async (req, res, next) => {
  try {
    const { name, phone, email, message, propertyId, source } = req.body;
    if (!name || !phone || !email) {
      const err = new Error('Name, phone and email are required');
      err.statusCode = 400;
      return next(err);
    }
    let propertyTitle = '';
    let propertyRef = null;
    if (propertyId && mongoose.isValidObjectId(propertyId)) {
      const prop = await Property.findById(propertyId).select('title').lean();
      if (prop) {
        propertyRef = prop._id;
        propertyTitle = prop.title;
      }
    }

    const rawSource =
      typeof source === 'string'
        ? source.trim().slice(0, 120)
        : '';
    /** Only accept known inbound sources */
    const safeSource =
      rawSource === 'navbar-book-call' ? rawSource : '';

    const lead = await Lead.create({
      name,
      phone,
      email,
      message: message || '',
      source: safeSource,
      property: propertyRef,
      propertyTitle,
    });

    try {
      const topic = propertyTitle || (safeSource ? 'Book a call (site)' : 'general');
      await sendInquiryEmail({
        subject: `New lead — ${name}`,
        text: `${name} (${email}, ${phone})\nRegarding: ${topic}\nSource: ${safeSource || '—'}\n\n${message || '—'}`,
        html: `<p><strong>${name}</strong> (${email}, ${phone})</p><p>${propertyTitle ? `Project: ${propertyTitle}` : 'No specific project'}${safeSource ? ` · <em>${safeSource}</em>` : ''}</p><p>${message || '—'}</p>`,
      });
    } catch (mailErr) {
      console.warn('Email notification failed:', mailErr.message);
    }

    res.status(201).json(lead);
  } catch (e) {
    next(e);
  }
};

export const listLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find().populate('property', 'title slug').sort({ createdAt: -1 }).lean();
    res.json(leads);
  } catch (e) {
    next(e);
  }
};

export const getLead = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error('Invalid id');
      err.statusCode = 400;
      return next(err);
    }
    const lead = await Lead.findById(req.params.id).populate('property', 'title slug').lean();
    if (!lead) {
      const err = new Error('Not found');
      err.statusCode = 404;
      return next(err);
    }
    res.json(lead);
  } catch (e) {
    next(e);
  }
};

export const updateLead = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error('Invalid id');
      err.statusCode = 400;
      return next(err);
    }
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      const err = new Error('Not found');
      err.statusCode = 404;
      return next(err);
    }
    if (req.body.read !== undefined) lead.read = Boolean(req.body.read);
    await lead.save();
    res.json(lead);
  } catch (e) {
    next(e);
  }
};

export const deleteLead = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error('Invalid id');
      err.statusCode = 400;
      return next(err);
    }
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    next(e);
  }
};
