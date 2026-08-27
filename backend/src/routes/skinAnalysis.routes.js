const express = require('express');
const router = express.Router();
const {
  submitQuizAnswers,
  processSelfieAnalysis,
  getUserSkinProfile
} = require('../controllers/skinAnalysis.controller');
const { aiLimiter } = require('../middleware/rateLimiter');

// POST /api/skin-analysis/quiz
router.post('/quiz', submitQuizAnswers);

// POST /api/skin-analysis/selfie (AI Rate Limited)
router.post('/selfie', aiLimiter, processSelfieAnalysis);

// GET /api/skin-analysis/profile/:userId
router.get('/profile/:userId', getUserSkinProfile);

module.exports = router;
