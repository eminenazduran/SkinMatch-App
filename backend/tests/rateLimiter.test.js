const request = require('supertest');
const express = require('express');
const rateLimit = require('express-rate-limit');

describe('Day 2: Rate Limiting Middleware Tests', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Test amaçlı düşük limitli AI Limiter (3 istek hakkı)
    const testAiLimiter = rateLimit({
      windowMs: 60 * 1000,
      max: 3,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        error: 'AI Rate Limit Exceeded',
        message: 'Yapay zeka analiz sınırına ulaştınız. Lütfen kısa bir süre bekleyip tekrar deneyin.'
      }
    });

    app.post('/api/test-ai-scan', testAiLimiter, (req, res) => {
      res.status(200).json({ success: true, message: 'Scan successful' });
    });
  });

  test('should allow requests within limit and block with 429 when limit exceeded', async () => {
    // İlk 3 istek başarılı olmalı (200)
    for (let i = 0; i < 3; i++) {
      const res = await request(app).post('/api/test-ai-scan').send({});
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    }

    // 4. istek 429 Too Many Requests dönmeli
    const blockedRes = await request(app).post('/api/test-ai-scan').send({});
    expect(blockedRes.status).toBe(429);
    expect(blockedRes.body.success).toBe(false);
    expect(blockedRes.body.error).toBe('AI Rate Limit Exceeded');
  });
});
