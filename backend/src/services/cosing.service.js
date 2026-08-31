const mongoose = require('mongoose');
const Ingredient = require('../models/Ingredient');

/**
 * EU CosIng (Avrupa Komisyonu Kozmetik Veritabanı) Eşleştirme ve Standartlaştırma Servisi
 */
class CosIngService {
  /**
   * Bir kimyasal bileşenin adını EU CosIng standart INCI sözlüğünde arar
   * @param {string} rawIngredientName - Taranan veya aranan bileşen adı
   * @returns {Promise<object|null>} - Eşleşen standart INCI kaydı
   */
  static async findStandardIngredient(rawIngredientName) {
    if (!rawIngredientName || typeof rawIngredientName !== 'string') return null;

    // Veritabanı bağlı değilse güvenli fallback
    if (mongoose.connection.readyState !== 1) {
      return null;
    }

    const normalized = rawIngredientName.trim().toUpperCase();

    try {
      // 1. Doğrudan INCI adı eşleşmesi
      let match = await Ingredient.findOne({ inciName: normalized }).maxTimeMS(2000);
      if (match) return match;

      // 2. Takma adlar / OCR varyasyonları (aliases) üzerinden eşleşme
      match = await Ingredient.findOne({
        aliases: { $regex: new RegExp(`^${normalized}$`, 'i') }
      }).maxTimeMS(2000);
      if (match) return match;

      // 3. Metin araması (Fuzzy / Text search)
      match = await Ingredient.findOne({
        $text: { $search: rawIngredientName }
      }).maxTimeMS(2000);

      return match;
    } catch (err) {
      return null;
    }
  }

  /**
   * Ayrıştırılmış bir INCI listesini EU CosIng veritabanı ile eşleştirerek zenginleştirir
   * @param {string[]} ingredientsList - Ayrıştırılmış ham bileşen dizisi
   * @returns {Promise<Array>} - Standartlaştırılmış ve detaylandırılmış bileşen bilgileri
   */
  static async enrichIngredientsList(ingredientsList = []) {
    if (!Array.isArray(ingredientsList) || ingredientsList.length === 0) return [];

    const enriched = await Promise.all(
      ingredientsList.map(async (name) => {
        const standardData = await this.findStandardIngredient(name);
        return {
          rawName: name,
          standardInci: standardData ? standardData.inciName : name.toUpperCase(),
          commonName: standardData ? standardData.commonName : null,
          functions: standardData ? standardData.cosmeticFunction : [],
          comedogenicRating: standardData ? standardData.comedogenicRating : 0,
          irritancyRating: standardData ? standardData.irritancyRating : 0,
          isKnownInDatabase: Boolean(standardData)
        };
      })
    );

    return enriched;
  }
}

module.exports = CosIngService;
