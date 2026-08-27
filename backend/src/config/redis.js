const Redis = require('ioredis');
const NodeCache = require('node-cache');

// In-Memory Fallback Cache (5 dakikalık varsayılan TTL)
const memoryCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

let redisClient = null;
let isRedisAvailable = false;

if (process.env.REDIS_URL) {
  try {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: true,
      retryStrategy: () => null // Bağlanamazsa sürekli log spam'i yapmadan memory cache'e geç
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis Önbellek Bağlantısı Başarılı');
      isRedisAvailable = true;
    });

    redisClient.on('error', () => {
      isRedisAvailable = false;
    });
  } catch {
    isRedisAvailable = false;
  }
}

/**
 * Önbellekten veri oku (Redis varsa Redis'ten, yoksa MemoryCache'ten)
 */
const getCache = async (key) => {
  try {
    if (isRedisAvailable && redisClient) {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    }
    return memoryCache.get(key) || null;
  } catch {
    return memoryCache.get(key) || null;
  }
};

/**
 * Önbelleğe veri yaz
 */
const setCache = async (key, value, ttlSeconds = 3600) => {
  try {
    const stringValue = JSON.stringify(value);
    if (isRedisAvailable && redisClient) {
      await redisClient.set(key, stringValue, 'EX', ttlSeconds);
    }
    memoryCache.set(key, value, ttlSeconds);
  } catch (err) {
    memoryCache.set(key, value, ttlSeconds);
  }
};

module.exports = {
  getCache,
  setCache,
  redisClient
};
