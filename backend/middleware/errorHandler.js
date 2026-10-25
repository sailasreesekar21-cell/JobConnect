function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Please correct the highlighted fields.',
      errors,
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    const message =
      field === 'email'
        ? 'An account with this email already exists.'
        : field === 'job'
          ? 'You have already applied for this job.'
          : 'This record already exists.';
    return res.status(409).json({ success: false, message });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid identifier provided.' });
  }

  const status = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  return res.status(status).json({
    success: false,
    message: status === 500 && isProd ? 'Something went wrong on the server.' : err.message,
  });
}

module.exports = { notFound, errorHandler };
