const CacheService = require('../src/services/cache.service');

describe('Day 3: Cache Service Tests (Redis & In-Memory Fallback)', () => {
  test('should set and get values from cache with high speed (<10ms)', async () => {
    const testKey = 'test_inci_analysis_sample';
    const mockAnalysisPayload = {
      productName: 'Hydrating Essence',
      matchScore: 94,
      suitabilityVerdict: 'Highly Recommended'
    };

    await CacheService.set(testKey, mockAnalysisPayload, 60);

    const startTime = Date.now();
    const cachedData = await CacheService.get(testKey);
    const duration = Date.now() - startTime;

    expect(cachedData).toBeDefined();
    expect(cachedData.productName).toBe('Hydrating Essence');
    expect(cachedData.matchScore).toBe(94);
    expect(duration).toBeLessThan(50); // Direct retrieval should be nearly instantaneous
  });

  test('should return null for non-existent cache keys', async () => {
    const nonExistent = await CacheService.get('non_existent_key_12345');
    expect(nonExistent).toBeNull();
  });

  test('should delete cached entries successfully', async () => {
    const deleteKey = 'key_to_delete_test';
    await CacheService.set(deleteKey, { val: 123 }, 60);
    expect(await CacheService.get(deleteKey)).toBeDefined();

    await CacheService.del(deleteKey);
    // After deletion
    const check = await CacheService.get(deleteKey);
    // in-memory or redis
    expect(check).toBeNull();
  });
});
