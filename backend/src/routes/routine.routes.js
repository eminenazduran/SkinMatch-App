const express = require('express');
const router = express.Router();
const {
  getDashboardData,
  saveProductToRoutine
} = require('../controllers/routine.controller');

// GET /api/routine/dashboard
router.get('/dashboard', getDashboardData);

// POST /api/routine/save-product
router.post('/save-product', saveProductToRoutine);

module.exports = router;
