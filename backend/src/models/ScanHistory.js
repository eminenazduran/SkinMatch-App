const mongoose = require('mongoose');

const HeroIngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  inciStandardName: { type: String, required: true },
  purpose: { type: String }, // e.g. "Sebum Regulating / Pore Minimizing"
  benefitForUser: { type: String, required: true } // e.g. "Great for your oily T-zone"
}, { _id: false });

const FlaggedIngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  inciStandardName: { type: String, required: true },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  concernCategory: {
    type: String,
    enum: ['Irritant', 'Comedogenic', 'Allergen', 'Drying Alcohol', 'Fragrance', 'Other'],
    default: 'Other'
  },
  warningMessage: { type: String, required: true }
}, { _id: false });

const AiAnalysisSchema = new mongoose.Schema({
  productName: { type: String, default: 'Scanned Product' },
  matchScore: { type: Number, min: 0, max: 100, required: true },
  suitabilityVerdict: {
    type: String,
    enum: ['Highly Recommended', 'Suitable with Caution', 'Not Recommended'],
    required: true
  },
  skinTypeCompatibility: {
    skinType: { type: String },
    isCompatible: { type: Boolean, default: true },
    compatibilityNote: { type: String }
  },
  heroIngredients: [HeroIngredientSchema],
  flaggedIngredients: [FlaggedIngredientSchema],
  neutralOrBaseIngredients: [{ type: String }],
  overallSummary: { type: String, required: true },
  usageAdvice: {
    recommendedTime: {
      type: String,
      enum: ['Morning', 'Night', 'Both', 'Not Recommended'],
      default: 'Both'
    },
    frequency: { type: String, default: 'Daily' },
    layeringTips: { type: String }
  }
}, { _id: false });

const ScanHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    sparse: true
  },
  productName: {
    type: String,
    trim: true,
    default: 'Unknown Product'
  },
  brand: {
    type: String,
    trim: true
  },
  rawOcrText: {
    type: String,
    required: true
  },
  cleanedIngredients: [{
    type: String,
    trim: true
  }],
  userProfileSnapshot: {
    skinType: String,
    concerns: [String],
    sensitivities: [String]
  },
  aiAnalysis: {
    type: AiAnalysisSchema,
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ScanHistory', ScanHistorySchema);
