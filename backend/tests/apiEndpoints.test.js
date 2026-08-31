require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');

describe('Day 4: Backend REST API Endpoints & Controller Tests', () => {
  let createdScanId = null;

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

  // 1. Health Check
  test('GET /api/health should return 200 and status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe('ok');
  });

  // 2. Skin Analysis - Quiz
  test('POST /api/skin-analysis/quiz should validate input and save answers', async () => {
    // Geçersiz istek (boş answers)
    const invalidRes = await request(app).post('/api/skin-analysis/quiz').send({});
    expect(invalidRes.status).toBe(400);
    expect(invalidRes.body.success).toBe(false);

    // Geçerli istek
    const validRes = await request(app).post('/api/skin-analysis/quiz').send({
      answers: [
        { questionId: 'q1', selectedOptionId: 'opt_1', selectedOptionText: 'Gergin ve Kuru' }
      ]
    });
    expect(validRes.status).toBe(200);
    expect(validRes.body.success).toBe(true);
    expect(validRes.body.data.quizAnswersCount).toBe(1);
  });

  // 3. Skin Analysis - Selfie
  test('POST /api/skin-analysis/selfie should process facial metrics and return hybrid profile', async () => {
    const res = await request(app).post('/api/skin-analysis/selfie').send({
      metrics: {
        oilinessScore: 70,
        rednessScore: 15,
        poreScore: 60
      }
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.analysis).toBeDefined();
    expect(res.body.data.analysis.determinedSkinType).toBeDefined();
  });

  // 4. Ingredient Matcher - Scan
  test('POST /api/ingredient-matcher/scan should analyze ingredients and return score', async () => {
    const res = await request(app).post('/api/ingredient-matcher/scan').send({
      rawOcrText: 'Aqua, Niacinamide 10%, Zinc PCA 1%, Dimethicone, Phenoxyethanol',
      productName: 'Hydra Glow Serum'
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.aiAnalysis).toBeDefined();
    expect(res.body.data.aiAnalysis.matchScore).toBeGreaterThanOrEqual(0);
    expect(res.body.data.cleanedIngredients.length).toBeGreaterThan(0);

    if (res.body.data.scanId) {
      createdScanId = res.body.data.scanId;
    }
  });

  // 5. Ingredient Matcher - Dictionary Search
  test('GET /api/ingredient-matcher/ingredient/:name should return ingredient details from CosIng dictionary', async () => {
    const res = await request(app).get('/api/ingredient-matcher/ingredient/Niacinamide');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.inciName).toBe('NIACINAMIDE');
  });

  // 6. Routine - Dashboard
  test('GET /api/routine/dashboard should return environmental UV tips and routine structure', async () => {
    const res = await request(app).get('/api/routine/dashboard');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.environmental).toBeDefined();
    expect(res.body.data.environmental.uvIndex).toBeDefined();
    expect(res.body.data.routines).toBeDefined();
  });

  // 7. Routine - Save Product
  test('POST /api/routine/save-product should add product to morning/evening routine', async () => {
    const res = await request(app).post('/api/routine/save-product').send({
      timeOfDay: 'morning',
      productName: 'Daily Sun Protection SPF 50',
      category: 'Sunscreen',
      matchScore: 95
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.productName).toBe('Daily Sun Protection SPF 50');
  });

  // 8. History - List Scans
  test('GET /api/history should return array of scan records', async () => {
    const res = await request(app).get('/api/history');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // 9. 404 Handler
  test('GET /api/invalid-endpoint should trigger 404 NotFound handler', async () => {
    const res = await request(app).get('/api/invalid-endpoint-xyz');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('NotFound');
  });
});
