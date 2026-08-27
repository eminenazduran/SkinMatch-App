const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  inciName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  commonName: {
    type: String,
    trim: true
  },
  aliases: [{
    type: String,
    trim: true
  }], // e.g. OCR variations or synonyms: ['Nlacinamlde', 'Nicotinamide', 'Vitamin B3']
  cosmeticFunction: [{
    type: String,
    trim: true
  }], // e.g. ['Antioxidant', 'Skin Soothing', 'Humectant', 'Exfoliant']
  comedogenicRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  irritancyRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  description: {
    type: String,
    trim: true
  },
  suitableForSkinTypes: {
    Oily: { type: Boolean, default: true },
    Dry: { type: Boolean, default: true },
    Combination: { type: Boolean, default: true },
    Normal: { type: Boolean, default: true },
    Sensitive: { type: Boolean, default: true }
  },
  cautionNotes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for fast fuzzy search & OCR alias lookup
IngredientSchema.index({ inciName: 'text', commonName: 'text', aliases: 'text' });

module.exports = mongoose.model('Ingredient', IngredientSchema);
