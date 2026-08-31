const express = require('express');
const router = express.Router();
const {
  getScanHistory,
  deleteScanHistory,
  toggleFavorite
} = require('../controllers/history.controller');

// GET /api/history
router.get('/', getScanHistory);

// DELETE /api/history/:id
router.delete('/:id', deleteScanHistory);

// PATCH /api/history/favorite/:id
router.patch('/favorite/:id', toggleFavorite);

module.exports = router;
