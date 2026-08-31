const crypto = require('crypto');

/**
 * OCR Ham Metin Temizleyici ve INCI Ayrıştırıcı Servisi
 */

/**
 * OCR metninden başlıkları, pazarlama ifadelerini ve gürültülü sembolleri temizler
 * @param {string} rawText - OCR'dan veya kameradan gelen ham metin
 * @returns {string} - Temizlenmiş INCI metni
 */
const cleanOcrText = (rawText = '') => {
  if (!rawText || typeof rawText !== 'string') return '';

  let cleaned = rawText
    // Çok dilli yaygın başlıkları ayıkla (Ingredients, İçindekiler, Inhaltsstoffe, Ingrédients, vb.)
    .replace(/(?:active\s+ingredients?|inactive\s+ingredients?|ingredients?|içindekiler|içerik|inhaltsstoffe|composition|ingrédients?|ingredientes?|inci|contents)\s*[:：\-]/gi, '')
    // Pazarlama ve uyarı eklerini temizle (Örn: "May contain: +/- ...")
    .replace(/\[\s*\+\/\-[\s\w\d\,]*\]/gi, '')
    // Dipnot işaretleri ve yıldızları temizle (*, **, ***, •, ▪, ‣)
    .replace(/[\*\•\▪\‣\†\‡]/g, '')
    // Özel tırnak ve parantez varyasyonlarını standartlaştır
    .replace(/[“”«»]/g, '"')
    .replace(/[{}]/g, '()')
    // Gereksiz satır sonlarını ve tab boşluklarını tek boşluğa çevir
    .replace(/[\r\n\t]+/g, ' ')
    // Birden fazla boşluğu teke indir
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Sonunda nokta veya noktalı virgül varsa kaldır
  cleaned = cleaned.replace(/[\.\;]+$/, '');

  return cleaned;
};

/**
 * Temizlenmiş INCI metnini bileşen dizisine (string[]) ayrıştırır.
 * Parantez içindeki virgülleri (Örn: "Centella Asiatica Extract (and) Madecassoside") korur.
 * @param {string} cleanedText - Temizlenmiş INCI metni
 * @returns {string[]} - Ayrıştırılmış bileşen adları
 */
const parseIngredientsList = (cleanedText = '') => {
  if (!cleanedText) return [];

  // Parantez dışındaki virgüllere veya noktalı virgüllere göre böl
  const rawParts = cleanedText.split(/[,;](?![^(]*\))/g);

  return rawParts
    .map(item => {
      let trimmed = item.trim();
      // Başındaki liste numaralarını (1., 2-, a)) veya tireleri temizle
      trimmed = trimmed.replace(/^[\d\.\-\)\(\s]+/, '');
      // Baş/son tırnak işaretlerini temizle
      trimmed = trimmed.replace(/^["']+|["']+$/g, '');
      return trimmed.trim();
    })
    .filter(item => {
      // Çok kısa veya anlamsız bağlaçları filtrele
      if (item.length < 2) return false;
      if (/^(and|or|ve|veya|etc|contain|plus)$/i.test(item)) return false;
      return true;
    });
};

/**
 * OCR metni ve kullanıcı cilt tipine göre benzersiz MD5 Önbellek Anahtarı (Cache Key) üretir
 * @param {string} rawText - Taranan içerik metni
 * @param {string} skinType - Kullanıcı cilt tipi (Oily, Dry, vb.)
 * @returns {string} - Redis/Memory cache anahtarı (Örn: "inci_scan_a1b2c3d4...")
 */
const generateInciCacheKey = (rawText = '', skinType = 'Normal') => {
  const normalized = (rawText || '').toLowerCase().replace(/\s+/g, '');
  const hash = crypto.createHash('md5').update(`${normalized}_${skinType.toLowerCase()}`).digest('hex');
  return `inci_scan_${hash}`;
};

module.exports = {
  cleanOcrText,
  parseIngredientsList,
  generateInciCacheKey
};
