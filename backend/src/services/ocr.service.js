/**
 * OCR Ham Metin Temizleyici ve INCI Ayrıştırıcı Servisi
 */

/**
 * OCR metninden başlıkları, pazarlama kelimelerini ve gereksiz sembolleri temizler
 */
const cleanOcrText = (rawText = '') => {
  if (!rawText) return '';

  let cleaned = rawText
    // 'Ingredients:', 'İçindekiler:', 'Inhaltsstoffe:', 'Composition:' gibi başlıkları ayıkla
    .replace(/(?:ingredients?|içindekiler|inhaltsstoffe|composition|inci|contents)\s*[:：\-]/gi, '')
    // Gereksiz satır sonlarını tek boşluğa çevir
    .replace(/[\r\n]+/g, ' ')
    // Özel tırnak işaretlerini standartlaştır
    .replace(/[“”«»]/g, '"')
    // Birden fazla boşluğu teke indir
    .replace(/\s{2,}/g, ' ')
    .trim();

  return cleaned;
};

/**
 * Temizlenmiş INCI metnini virgül, nokta veya tire işaretlerine göre ayrıştırır
 */
const parseIngredientsList = (cleanedText = '') => {
  if (!cleanedText) return [];

  // Parantez içi virgülleri geçici koruyarak ana bileşen virgüllerinden böl
  const rawParts = cleanedText.split(/,(?![^(]*\))/g);

  return rawParts
    .map(item => item.trim().replace(/^[\d\.\-\*\•\s]+/, '').replace(/[\.\;]$/, '').trim())
    .filter(item => item.length > 1 && !/^(and|or|ve|veya)$/i.test(item));
};

module.exports = {
  cleanOcrText,
  parseIngredientsList
};
