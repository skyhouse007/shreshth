import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

export const protect = async (req, res, next) => {
  try {
    if (process.env.ADMIN_AUTH_DISABLED === 'true') {
      const admin = await Admin.findOne().select('-password');
      if (!admin) {
        const err = new Error(
          'Admin login is disabled but no admin exists in the database — run the seed script or turn off ADMIN_AUTH_DISABLED.'
        );
        err.statusCode = 503;
        return next(err);
      }
      req.admin = admin;
      return next();
    }

    let token;
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) {
      token = header.split(' ')[1];
    }
    if (!token) {
      const err = new Error('Not authorized — sign in again (no token).');
      err.statusCode = 401;
      return next(err);
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      const err = new Error('Server misconfiguration: JWT_SECRET is missing');
      err.statusCode = 500;
      return next(err);
    }
    const decoded = jwt.verify(token, secret);
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      const err = new Error('Not authorized — account no longer exists; sign up or contact support.');
      err.statusCode = 401;
      return next(err);
    }
    req.admin = admin;
    next();
  } catch (e) {
    if (e?.name === 'TokenExpiredError') {
      const err = new Error('Session expired — please log in again.');
      err.statusCode = 401;
      return next(err);
    }
    if (e?.name === 'JsonWebTokenError' || e?.name === 'NotBeforeError') {
      const err = new Error(
        'Not authorized — invalid session. Try logging out and logging in again (JWT_SECRET must stay the same on the server).'
      );
      err.statusCode = 401;
      return next(err);
    }
    const err = new Error(e?.message || 'Not authorized');
    err.statusCode = 401;
    next(err);
  }
};
