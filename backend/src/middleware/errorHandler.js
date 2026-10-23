function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || (err.message?.includes('CORS') ? 403 : 500);
  const isProduction = process.env.NODE_ENV === 'production';

  if (err.message?.includes('Only JPEG')) {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'Image must be under 5MB' });
  }

  const message =
    isProduction && statusCode === 500
      ? 'An unexpected error occurred'
      : err.message || 'An unexpected error occurred';

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;
