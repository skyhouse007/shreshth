import Admin from '../models/Admin.js';
import { generateToken } from '../middleware/auth.js';

export const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      const err = new Error('Name, email and password are required');
      err.statusCode = 400;
      return next(err);
    }
    const exists = await Admin.findOne({ email });
    if (exists) {
      const err = new Error('Email already registered');
      err.statusCode = 400;
      return next(err);
    }
    const admin = await Admin.create({ name, email, password });
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id.toString()),
    });
  } catch (e) {
    next(e);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const err = new Error('Email and password required');
      err.statusCode = 400;
      return next(err);
    }
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await admin.comparePassword(password))) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      return next(err);
    }
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id.toString()),
    });
  } catch (e) {
    next(e);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.json(req.admin);
  } catch (e) {
    next(e);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { name, phone, password } = req.body;
    const admin = await Admin.findById(req.admin._id).select('+password');
    if (!admin) {
      const err = new Error('Not found');
      err.statusCode = 404;
      return next(err);
    }
    if (name) admin.name = name;
    if (phone !== undefined) admin.phone = phone;
    if (password && password.length >= 4) admin.password = password;
    await admin.save();
    const out = admin.toObject();
    delete out.password;
    res.json(out);
  } catch (e) {
    next(e);
  }
};
