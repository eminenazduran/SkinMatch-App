const rateLimit = require('express-rate-limit');

/**
 * Genel API Hız Sınırlandırıcısı (General Rate Limiter)
 * 15 dakikada en fazla 100 istek
 */
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 dakika
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'Çok fazla istek gönderildi. Lütfen 15 dakika sonra tekrar deneyin.'
  }
});

/**
 * Yapay Zeka (AI / Gemini) Uç Noktaları Hız Sınırlandırıcısı
 * 15 dakikada en fazla 20 AI tarama/analiz isteği (Maliyet ve abuse koruması)
 */
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: parseInt(process.env.AI_RATE_LIMIT_MAX_REQUESTS || '20', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'AI Rate Limit Exceeded',
    message: 'Yapay zeka analiz sınırına ulaştınız. Lütfen kısa bir süre bekleyip tekrar deneyin.'
  }
});

module.exports = {
  generalLimiter,
  aiLimiter
};
