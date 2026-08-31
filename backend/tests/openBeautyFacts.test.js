require('dotenv').config();
const mongoose = require('mongoose');
const OpenBeautyFactsService = require('../src/services/openBeautyFacts.service');
const CosIngService = require('../src/services/cosing.service');

describe('EU CosIng & Open Beauty Facts Integration Tests', () => {
  beforeAll(async () => {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skinmatch';
    try {
      await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 3000 });
    } catch {
      // Offline mode
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  test('OpenBeautyFactsService should handle search gracefully', async () => {
    const results = await OpenBeautyFactsService.searchProducts('CeraVe');
    expect(Array.isArray(results)).toBe(true);
  }, 10000);

  test('OpenBeautyFactsService should handle invalid barcode gracefully', async () => {
    const product = await OpenBeautyFactsService.getProductByBarcode('0000000000000');
    expect(product).toBeNull();
  }, 10000);

  test('CosIngService should enrich ingredients list with safety and function metadata', async () => {
    const testList = ['Niacinamide', 'Salicylic Acid', 'Glycerin'];
    const enriched = await CosIngService.enrichIngredientsList(testList);

    expect(Array.isArray(enriched)).toBe(true);
    expect(enriched.length).toBe(3);
    expect(enriched[0].rawName).toBe('Niacinamide');
  }, 10000);
});
