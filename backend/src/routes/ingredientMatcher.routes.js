const express = require('express');
const router = express.Router();
const {
  scanAndAnalyzeIngredients,
  getScanHistory
} = require('../controllers/ingredientMatcher.controller');
const { aiLimiter } = require('../middleware/rateLimiter');

// POST /api/ingredient-matcher/scan (Protected with AI Rate Limiter)
router.post('/scan', aiLimiter, scanAndAnalyzeIngredients);

// GET /api/ingredient-matcher/history
router.get('/history', getScanHistory);

module.exports = router;
