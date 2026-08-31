const express = require('express');
const router = express.Router();
const {
  getDashboardData,
  saveProductToRoutine,
  removeProductFromRoutine
} = require('../controllers/routine.controller');

// GET /api/routine/dashboard
router.get('/dashboard', getDashboardData);

// POST /api/routine/save-product
router.post('/save-product', saveProductToRoutine);

// DELETE /api/routine/product
router.delete('/product', removeProductFromRoutine);

module.exports = router;
