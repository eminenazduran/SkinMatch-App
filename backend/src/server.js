require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { generalLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Rota İçe Aktarımları
const skinAnalysisRoutes = require('./routes/skinAnalysis.routes');
const ingredientMatcherRoutes = require('./routes/ingredientMatcher.routes');
const routineRoutes = require('./routes/routine.routes');
const historyRoutes = require('./routes/history.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Veritabanı Bağlantısı
connectDB();

// Güvenlik & Ara Katmanlar
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Genel Rate Limiter
app.use(generalLimiter);

// Sağlık Kontrolü (Health Check)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    service: 'SkinMatch AI Backend',
    timestamp: new Date().toISOString()
  });
});

// API Rotaları
app.use('/api/skin-analysis', skinAnalysisRoutes);
app.use('/api/ingredient-matcher', ingredientMatcherRoutes);
app.use('/api/routine', routineRoutes);
app.use('/api/history', historyRoutes);

// Hata Yakalayıcılar
app.use(notFoundHandler);
app.use(errorHandler);

// Sunucuyu Başlat (Test modunda değilse başlat)
let server = null;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🌸 SkinMatch App Backend Sunucusu Çalışıyor!`);
    console.log(`🚀 Port: ${PORT}`);
    console.log(`🌐 API Sağlık Kontrolü: http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });
}

module.exports = app;
