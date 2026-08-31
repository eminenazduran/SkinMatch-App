require('dotenv').config();
const { analyzeIngredientsWithGemini, analyzeSkinHybridWithGemini } = require('../src/services/gemini.service');

describe('Day 2: Gemini AI Service & OCR Error Tolerance Tests', () => {
  test('should tolerate OCR misspellings (e.g. Nlacinamlde -> Niacinamide) and return valid structured JSON', async () => {
    // Kasıtlı OCR harf bozulmaları içeren INCI listesi
    const noisyOcrInci = 'Aqua/Water, Nlacinamlde 10%, Zlnc PCA 1%, Phenoxyethan0l, Hyaluronlc Acld, Alcohol Denat.';
    const userProfile = {
      skinType: 'Oily',
      concerns: ['Acne', 'Large Pores'],
      sensitivities: ['Alcohol Denat']
    };

    const result = await analyzeIngredientsWithGemini(noisyOcrInci, userProfile);

    expect(result).toBeDefined();
    expect(typeof result.matchScore).toBe('number');
    expect(result.matchScore).toBeGreaterThanOrEqual(0);
    expect(result.matchScore).toBeLessThanOrEqual(100);

    expect(['Highly Recommended', 'Suitable with Caution', 'Not Recommended']).toContain(result.suitabilityVerdict);
    expect(result.skinTypeCompatibility).toBeDefined();
    expect(Array.isArray(result.heroIngredients)).toBe(true);
    expect(Array.isArray(result.flaggedIngredients)).toBe(true);
    expect(result.heroIngredients.length).toBeGreaterThan(0);

    // Niacinamide veya Hyaluronic Acid hero listesinde yer almalı
    const heroNames = result.heroIngredients.map(h => h.name.toLowerCase() + ' ' + (h.inciStandardName || '').toLowerCase());
    const matchedHero = heroNames.some(name => name.includes('niacinamide') || name.includes('niasinamid') || name.includes('hyaluronic'));
    expect(matchedHero).toBe(true);

    // Alcohol Denat flagged listesinde yer almalı
    const flaggedNames = result.flaggedIngredients.map(f => f.name.toLowerCase() + ' ' + (f.inciStandardName || '').toLowerCase());
    const matchedFlagged = flaggedNames.some(name => name.includes('alcohol'));
    expect(matchedFlagged).toBe(true);

    expect(typeof result.overallSummary).toBe('string');
    expect(result.usageAdvice).toBeDefined();
  });

  test('should perform hybrid skin analysis with quiz answers and selfie metrics', async () => {
    const quizAnswers = [
      { questionId: 'q1', selectedOptionId: 'opt_oily', weightEffect: { oiliness: 2 } },
      { questionId: 'q2', selectedOptionId: 'opt_pores', weightEffect: { oiliness: 1 } }
    ];
    const selfieMetrics = {
      oilinessScore: 75,
      rednessScore: 20,
      poreScore: 65
    };

    const result = await analyzeSkinHybridWithGemini(quizAnswers, selfieMetrics);

    expect(result).toBeDefined();
    expect(result.determinedSkinType).toBeDefined();
    expect(['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive']).toContain(result.determinedSkinType);
    expect(result.barrierHealth).toBeDefined();
    expect(Array.isArray(result.keyRecommendations)).toBe(true);
    expect(Array.isArray(result.ingredientsToLookFor)).toBe(true);
    expect(Array.isArray(result.ingredientsToAvoid)).toBe(true);
  });
});
