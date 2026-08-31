const { cleanOcrText, parseIngredientsList, generateInciCacheKey } = require('../src/services/ocr.service');

describe('Day 3: OCR Text Cleaner, Tokenizer & Hash Tests', () => {
  test('cleanOcrText should strip multilingual headers, asterisk footnotes, and unwanted symbols', () => {
    const rawOcrInput = `
      ACTIVE INGREDIENTS: Salicylic Acid 2%*
      INACTIVE INGREDIENTS: Aqua / Water, Nlacinamlde 10%**, Zlnc PCA, Glycerin, Phenoxyethan0l.
      *Dermatologically tested.
      **Concentrated formula.
    `;

    const cleaned = cleanOcrText(rawOcrInput);

    expect(cleaned).not.toContain('ACTIVE INGREDIENTS:');
    expect(cleaned).not.toContain('INACTIVE INGREDIENTS:');
    expect(cleaned).not.toContain('*');
    expect(cleaned).not.toContain('**');
    expect(cleaned).toContain('Aqua / Water');
    expect(cleaned).toContain('Nlacinamlde 10%');
  });

  test('parseIngredientsList should accurately split ingredients without breaking parenthetical clauses', () => {
    const cleanedText = 'Aqua, Niacinamide, Centella Asiatica Extract (and) Madecassoside, Sodium Hyaluronate, Dimethicone, Parfum';

    const ingredients = parseIngredientsList(cleanedText);

    expect(Array.isArray(ingredients)).toBe(true);
    expect(ingredients.length).toBe(6);
    expect(ingredients[0]).toBe('Aqua');
    expect(ingredients[1]).toBe('Niacinamide');
    expect(ingredients[2]).toBe('Centella Asiatica Extract (and) Madecassoside');
    expect(ingredients[3]).toBe('Sodium Hyaluronate');
    expect(ingredients[4]).toBe('Dimethicone');
    expect(ingredients[5]).toBe('Parfum');
  });

  test('generateInciCacheKey should produce consistent MD5 hashes for caching', () => {
    const raw1 = 'Aqua, Niacinamide, Zinc PCA';
    const raw2 = 'Aqua,  Niacinamide,   Zinc PCA ';

    const key1 = generateInciCacheKey(raw1, 'Oily');
    const key2 = generateInciCacheKey(raw2, 'Oily');
    const key3 = generateInciCacheKey(raw1, 'Dry');

    expect(key1).toBe(key2); // Whitespace normalized hash should match
    expect(key1).not.toBe(key3); // Different skin type should generate different cache key
    expect(key1.startsWith('inci_scan_')).toBe(true);
  });
});
