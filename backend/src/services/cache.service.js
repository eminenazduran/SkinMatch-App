const { getCache, setCache, deleteCache } = require('../config/redis');

/**
 * SkinMatch Merkezi Önbellek (Cache) Servisi
 * Redis aktifse Redis'e, aksi halde yüksek performanslı Node-Cache (bellek içi) katmanına yazar.
 */
class CacheService {
  /**
   * Anahtara göre önbellekten veri çeker
   * @param {string} key - Önbellek anahtarı
   * @returns {Promise<any|null>}
   */
  static async get(key) {
    return await getCache(key);
  }

  /**
   * Veriyi önbelleğe kaydeder
   * @param {string} key - Önbellek anahtarı
   * @param {any} value - Kaydedilecek nesne/değer
   * @param {number} ttlSeconds - Yaşam süresi (saniye cinsinden, varsayılan 3600 = 1 saat)
   * @returns {Promise<void>}
   */
  static async set(key, value, ttlSeconds = 3600) {
    await setCache(key, value, ttlSeconds);
  }

  /**
   * Belirtilen anahtarı önbellekten siler
   * @param {string} key - Silinecek anahtar
   * @returns {Promise<boolean>}
   */
  static async del(key) {
    return await deleteCache(key);
  }
}

module.exports = CacheService;
