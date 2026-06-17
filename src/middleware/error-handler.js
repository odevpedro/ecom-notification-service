const crypto = require('crypto');

function errorHandler(err, req, res, _next) {
  const requestId = req.requestId || crypto.randomUUID();
  const message = err.message || 'Internal server error';
  const status = err.status || 500;

  res.status(status).json({
    data: null,
    error: { code: err.code || 'INTERNAL_ERROR', message, details: {} },
    meta: { requestId },
  });
}

module.exports = errorHandler;
