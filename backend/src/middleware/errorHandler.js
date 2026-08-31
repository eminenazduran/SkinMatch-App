/**
 * Asenkron fonksiyonları sarmalayarak try/catch kalabalığını önleyen yardımcı middleware (Async Handler)
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Global Hata Yakalayıcı Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('💥 Sunucu Hatası:', err);

  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  res.status(statusCode).json({
    success: false,
    error: err.name || 'InternalServerError',
    message: err.message || 'Sunucuda beklenmeyen bir hata oluştu.',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

/**
 * 404 Bulunamadı Middleware
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'NotFound',
    message: `İstenen uç nokta (${req.originalUrl}) bu sunucuda bulunamadı.`
  });
};

module.exports = {
  asyncHandler,
  errorHandler,
  notFoundHandler
};
