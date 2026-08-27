const mongoose = require('mongoose');

const QuizAnswerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  questionText: { type: String },
  selectedOptionId: { type: String, required: true },
  selectedOptionText: { type: String, required: true },
  weightEffect: {
    oiliness: { type: Number, default: 0 },
    dryness: { type: Number, default: 0 },
    sensitivity: { type: Number, default: 0 },
  }
}, { _id: false });

const SelfieAnalysisSchema = new mongoose.Schema({
  photoUrl: { type: String },
  oilinessScore: { type: Number, min: 0, max: 100, default: 50 },
  rednessScore: { type: Number, min: 0, max: 100, default: 10 },
  poreScore: { type: Number, min: 0, max: 100, default: 30 },
  analyzedAt: { type: Date, default: Date.now },
  aiInsights: { type: String }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    index: true,
    sparse: true
  },
  name: {
    type: String,
    trim: true,
    default: 'Skincare Enthusiast'
  },
  skinProfile: {
    skinType: {
      type: String,
      enum: ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive', 'Not Determined'],
      default: 'Not Determined'
    },
    barrierHealth: {
      type: String,
      enum: ['Healthy', 'Compromised', 'Needs Repair', 'Unknown'],
      default: 'Unknown'
    },
    primaryConcerns: [{
      type: String,
      enum: [
        'Acne',
        'Redness',
        'Hyperpigmentation',
        'Large Pores',
        'Fine Lines',
        'Dullness',
        'Dehydration',
        'Blackheads'
      ]
    }],
    knownSensitivities: [{
      type: String,
      trim: true
    }], // e.g. ['Fragrance', 'Alcohol Denat', 'Essential Oils', 'Sulfates']
    quizAnswers: [QuizAnswerSchema],
    selfieAnalysis: SelfieAnalysisSchema,
    lastAnalysisDate: { type: Date }
  },
  savedRoutines: {
    morning: [{
      productName: { type: String, required: true },
      brand: { type: String },
      category: {
        type: String,
        enum: ['Cleanser', 'Toner', 'Serum', 'Moisturizer', 'Sunscreen', 'Treatment', 'Other'],
        default: 'Other'
      },
      matchScore: { type: Number, min: 0, max: 100 },
      addedAt: { type: Date, default: Date.now }
    }],
    evening: [{
      productName: { type: String, required: true },
      brand: { type: String },
      category: {
        type: String,
        enum: ['Oil Cleanser', 'Cleanser', 'Exfoliant', 'Toner', 'Serum', 'Night Cream', 'Mask', 'Other'],
        default: 'Other'
      },
      matchScore: { type: Number, min: 0, max: 100 },
      addedAt: { type: Date, default: Date.now }
    }]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
