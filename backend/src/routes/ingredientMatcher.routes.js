const express = require('express');
const router = express.Router();
const {
  scanAndAnalyzeIngredients,
  getIngredientDetails,
  getProductByBarcode
} = require('../controllers/ingredientMatcher.controller');
const { aiLimiter } = require('../middleware/rateLimiter');

// POST /api/ingredient-matcher/scan (Protected with AI Rate Limiter)
router.post('/scan', aiLimiter, scanAndAnalyzeIngredients);

// GET /api/ingredient-matcher/ingredient/:name (Bileşen Sözlüğü Sorgulama)
router.get('/ingredient/:name', getIngredientDetails);

// GET /api/ingredient-matcher/barcode/:barcode (Open Beauty Facts Barkod Sorgulama)
router.get('/barcode/:barcode', getProductByBarcode);

module.exports = router;
