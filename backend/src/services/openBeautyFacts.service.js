const axios = require('axios');
const { getCache, setCache } = require('../config/redis');

/**
 * Open Beauty Facts API Entegrasyon Servisi
 * Açık kaynaklı kozmetik veritabanından barkod ile ürün arama ve INCI listesi çekme.
 */
class OpenBeautyFactsService {
  static BASE_URL = 'https://world.openbeautyfacts.org/api/v0/product';

  /**
   * Barkod numarasına göre ürün detaylarını ve INCI listesini getirir
   * @param {string} barcode - Ürün barkod numarası (EAN-13, UPC vb.)
   * @returns {Promise<object|null>} - Ürün bilgileri veya bulunamazsa null
   */
  static async getProductByBarcode(barcode) {
    if (!barcode || typeof barcode !== 'string') {
      return null;
    }

    const cleanBarcode = barcode.trim();
    const cacheKey = `obf_barcode_${cleanBarcode}`;

    // 1. Önce önbellekten kontrol et
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await axios.get(`${this.BASE_URL}/${cleanBarcode}.json`, {
        timeout: 8000,
        headers: {
          'User-Agent': 'SkinMatchApp - Android/iOS Skincare Reader - Version 1.0'
        }
      });

      if (response.data && response.data.status === 1 && response.data.product) {
        const p = response.data.product;

        const productPayload = {
          barcode: cleanBarcode,
          productName: p.product_name || p.product_name_en || p.generic_name || 'Bilinmeyen Ürün',
          brand: p.brands || p.brands_tags?.[0] || 'Bilinmeyen Marka',
          rawIngredientsText: p.ingredients_text || p.ingredients_text_en || p.ingredients_text_with_allergens || '',
          ingredientsHierarchy: p.ingredients_tags || [],
          imageUrl: p.image_url || p.image_front_url || null,
          source: 'OpenBeautyFacts'
        };

        // 7 Günlük önbelleğe al (statik ürün verisi)
        await setCache(cacheKey, productPayload, 7 * 24 * 3600);

        return productPayload;
      }

      return null;
    } catch (error) {
      console.warn(`⚠️ OpenBeautyFacts API Hatası (${cleanBarcode}):`, error.message);
      return null;
    }
  }

  /**
   * Ürün veya marka adına göre arama yapar
   * @param {string} query - Arama terimi (Örn: "CeraVe Hydrating Cleanser")
   * @returns {Promise<Array>} - Bulunan ürünler listesi
   */
  static async searchProducts(query) {
    if (!query || query.trim().length < 2) return [];

    const searchUrl = 'https://world.openbeautyfacts.org/cgi/search.pl';
    const cacheKey = `obf_search_${encodeURIComponent(query.toLowerCase().trim())}`;

    const cachedSearch = await getCache(cacheKey);
    if (cachedSearch) return cachedSearch;

    try {
      const response = await axios.get(searchUrl, {
        params: {
          search_terms: query,
          search_simple: 1,
          action: 'process',
          json: 1,
          page_size: 10
        },
        timeout: 8000,
        headers: {
          'User-Agent': 'SkinMatchApp - Android/iOS Skincare Reader - Version 1.0'
        }
      });

      if (response.data && response.data.products) {
        const results = response.data.products.map(p => ({
          barcode: p.code || p.id,
          productName: p.product_name || p.product_name_en || 'İsimsiz Ürün',
          brand: p.brands || '',
          rawIngredientsText: p.ingredients_text || p.ingredients_text_en || '',
          imageUrl: p.image_front_small_url || p.image_url || null
        }));

        await setCache(cacheKey, results, 86400); // 24 saat önbellek
        return results;
      }

      return [];
    } catch (error) {
      console.warn(`⚠️ OpenBeautyFacts Arama Hatası (${query}):`, error.message);
      return [];
    }
  }
}

module.exports = OpenBeautyFactsService;
