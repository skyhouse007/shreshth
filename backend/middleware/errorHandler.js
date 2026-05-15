export const notFound = (req, res, next) => {
  const err = new Error(`Not Found - ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode && Number.isFinite(err.statusCode) ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    console.error(err.stack);
  }
  res.status(statusCode).json({
    message,
    ...(err.errors && { errors: err.errors }),
  });
};
