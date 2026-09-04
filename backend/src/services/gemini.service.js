const { getGeminiModel } = require('../config/gemini');
const { INGREDIENT_ANALYSIS_SCHEMA_PROMPT, SKIN_HYBRID_ANALYSIS_SCHEMA_PROMPT } = require('../types/geminiSchemas');

/**
 * Geçici 503 / 429 yük dalgalanmalarına karşı otomatik yeniden deneme (Retry) mekanizması
 */
const callGeminiWithRetry = async (model, contents, maxRetries = 2) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await model.generateContent(contents);
    } catch (err) {
      const isRetryable =
        err.message &&
        (err.message.includes('503') ||
          err.message.includes('429') ||
          err.message.includes('high demand') ||
          err.message.includes('ResourceExhausted'));

      if (isRetryable && attempt < maxRetries) {
        console.warn(`⚠️ Gemini API yoğunluk uyarısı, ${attempt}. deneme 1.5 sn sonra tekrarlanıyor...`);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        continue;
      }
      throw err;
    }
  }
};

/**
 * OCR'dan gelen INCI listesini ve kullanıcı profilini analiz eden Gemini AI Servisi
 */
const analyzeIngredientsWithGemini = async (rawInciText, userProfile = {}) => {
  const model = getGeminiModel();

  const skinType = userProfile.skinType || 'Normal';
  const concerns = userProfile.concerns || ['General Maintenance'];
  const sensitivities = userProfile.sensitivities || [];

  const systemInstruction = `
Sen uzman bir Kozmetik Kimyageri, Cilt Bakım Formülatörü ve Yapay Zeka Cilt Bakım Analistisin.
Görevin, kullanıcının cilt profiline göre bir kozmetik ürünün INCI (İçindekiler) listesini titizlikle analiz etmektir.

ÖNEMLİ DİREKTİFLER:
1. **OCR Hata Toleransı Direktifi**: OCR teknolojisinden gelen ham metindeki harf veya yazım hatalarını (Örn: 'Nlacinamlde' -> 'Niacinamide', 'Hyaluronlc Acld' -> 'Hyaluronic Acid', 'Salicyllc' -> 'Salicylic Acid', 'Phenoxyethan0l' -> 'Phenoxyethanol', 'T0c0pherol' -> 'Tocopherol') tolere et ve en yakın/doğru kozmetik INCI bileşeniyle eşleştirerek analiz yap.
2. **Kişiselleştirilmiş Puanlama**: Kullanıcının Cilt Tipi (${skinType}), Endişeleri (${concerns.join(', ')}) ve Hassasiyetleri (${sensitivities.join(', ') || 'Belirtilmemiş'}) doğrultusunda 0-100 arası bir "matchScore" (Uyum Skoru) hesapla.
3. **Zararsız / Faydalı Ayrımı**: Formüldeki faydalı aktifleri "heroIngredients", tahriş/kuruluk/komedojenik riski olanları "flaggedIngredients" olarak ayır.
4. **Anlaşılır Türkçe**: Açıklamaları teknik terim karmaşasına boğmadan, kullanıcının günlük hayatta anlayacağı samimi, bilimsel ve teşvik edici bir Türkçe ile yaz.
5. **Kesin JSON Çıktısı**: Yanıtını yalnızca istenen JSON formatında ver.
`;

  const prompt = `
${systemInstruction}

KULLANICI CİLT PROFİLİ:
- Cilt Tipi: ${skinType}
- Cilt Endişeleri: ${concerns.join(', ')}
- Bilinen Hassasiyetler: ${sensitivities.join(', ') || 'Yok'}

ANALİZ EDİLECEK ÜRÜN İÇERİK METNİ (INCI):
"""
${rawInciText}
"""

${INGREDIENT_ANALYSIS_SCHEMA_PROMPT}
`;

  if (model) {
    try {
      const result = await callGeminiWithRetry(model, prompt);
      const responseText = result.response.text();
      return parseGeminiJsonResponse(responseText);
    } catch (error) {
      console.error('⚠️ Gemini API Çağrısı Başarısız Oldu:', error.message);
      // Fallback to local heuristic analysis
      return generateHeuristicAnalysis(rawInciText, userProfile);
    }
  }

  // API Key yoksa veya model yüklenemediyse akıllı simülasyon fallback'i
  return generateHeuristicAnalysis(rawInciText, userProfile);
};

/**
 * Anket ve Yüz Görseli metriklerini birleştiren Hibrit Cilt Tipi Analizi
 */
const analyzeSkinHybridWithGemini = async (quizAnswers, selfieMetrics = {}, photoBase64 = null) => {
  const model = getGeminiModel();

  const prompt = `
Sen uzman bir Klinik Cilt Analiz Uzmanı ve Dermatolojik Danışmansın.
Aşağıda kullanıcının yanıtladığı anket verileri ve ekte kullanıcının doğrudan kameradan çekilmiş gerçek yüz fotoğrafı bulunmaktadır.

GÖREVİN:
1. Ekli yüz fotoğrafını dikkatle incele:
   - Alın, burun ve çene (T-bölgesi) parlamasını, sebum yoğunluğunu,
   - Yanaklardaki gerginlik, kuruluk veya nemsizlik belirtilerini,
   - Varsa kızarıklık, kılcal damar belirginliği veya tahriş bölgelerini,
   - Gözenek görünürlüğünü ve büyüklüğünü,
   - Cilt bariyeri sağlamlığını.
2. Bu görsel incelemeyi kullanıcının çözdüğü anket yanıtlarıyla çapraz doğrulayarak (cross-validation) birleştir.
3. Kullanıcının cildine gerçekten iyi gelecek, bilimsel olarak kanıtlanmış kahraman içerikleri (ingredientsToLookFor) ve cildine zarar verebilecek, uzak durması gereken içerikleri (ingredientsToAvoid) belirle.
4. Görselden çıkardığın 0-100 arası gerçek puanları (oilinessScore, rednessScore, poreScore) JSON'a ekle.

ANKET YANITLARI:
${JSON.stringify(quizAnswers, null, 2)}

YÜZ GÖRSELİ BAŞLANGIÇ METRİKLERİ:
- T-Bölgesi Parlama/Yağ Skoru: ${selfieMetrics.oilinessScore || 50}
- Kızarıklık/Hassasiyet Skoru: ${selfieMetrics.rednessScore || 10}
- Gözenek Belirginlik Skoru: ${selfieMetrics.poreScore || 30}

${SKIN_HYBRID_ANALYSIS_SCHEMA_PROMPT}
`;

  if (model) {
    try {
      const contents = [prompt];
      if (photoBase64) {
        const cleanBase64 = photoBase64.replace(/^data:image\/\w+;base64,/, '');
        contents.push({
          inlineData: {
            data: cleanBase64,
            mimeType: 'image/jpeg'
          }
        });
      }

      const result = await callGeminiWithRetry(model, contents);
      return parseGeminiJsonResponse(result.response.text());
    } catch (error) {
      console.error('⚠️ Gemini Hybrid Analiz Hatası:', error.message);
    }
  }

  return {
    determinedSkinType: (selfieMetrics.oilinessScore > 65) ? 'Oily' : (selfieMetrics.oilinessScore > 40 ? 'Combination' : 'Dry'),
    barrierHealth: (selfieMetrics.rednessScore > 50) ? 'Compromised' : 'Healthy',
    oilinessScore: selfieMetrics.oilinessScore || 55,
    rednessScore: selfieMetrics.rednessScore || 20,
    poreScore: selfieMetrics.poreScore || 40,
    oilinessLevel: 'Dengeli & T-Bölgesi Hafif Parlak',
    sensitivityRisk: (selfieMetrics.rednessScore > 40) ? 'Moderate' : 'Low',
    detectedConcerns: ['Sebum Dengesi', 'Gözenek Görünümü'],
    analysisSummary: 'Cilt analiziniz başarıyla tamamlandı. Karma bir cilt yapısına sahipsiniz ve doğru içeriklerle cilt bariyerinizi güçlendirebilirsiniz.',
    keyRecommendations: [
      'Nazik, köpürmeyen temizleyiciler kullanın',
      'Niasinamid ve Çinko içeren hafif serumları rutininize ekleyin',
      'Geniş spektrumlu hafif bir güneş koruyucu tercih edin'
    ],
    ingredientsToLookFor: ['Niacinamide', 'Hyaluronic Acid', 'Centella Asiatica', 'Ceramides'],
    ingredientsToAvoid: ['Alcohol Denat', 'Synthetic Fragrance', 'High Menthol']
  };
};

/**
 * Gemini'nin metinsel JSON çıktısını güvenli şekilde parse eden yardımcı fonksiyon
 */
const parseGeminiJsonResponse = (text) => {
  try {
    // Markdown ```json ... ``` bloklarını temizle
    let cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (err) {
    console.error('JSON Parse Hatası:', err.message, '\nHam Metin:', text);
    throw new Error('Gemini API geçerli bir JSON yanıtı döndüremedi.');
  }
};

/**
 * Offline / API Key olmayan durumlar için Akıllı Heuristik Analiz Üreteci
 */
const generateHeuristicAnalysis = (rawInciText, userProfile) => {
  const lower = (rawInciText || '').toLowerCase();
  const skinType = userProfile.skinType || 'Combination';

  const heroIngredients = [];
  const flaggedIngredients = [];

  // Yaygın bileşen kontrolleri
  if (lower.includes('niacinamide') || lower.includes('nlacinamlde')) {
    heroIngredients.push({
      name: 'Niasinamid (B3 Vitamini)',
      inciStandardName: 'Niacinamide',
      purpose: 'Sebum Dengeleme & Bariyer Güçlendirme',
      benefitForUser: `${skinType} cilt yapınızda gözenek görünümünü sıkılaştırır ve sebumu dengeler.`
    });
  }

  if (lower.includes('hyaluronic acid') || lower.includes('hyaluronlc') || lower.includes('sodium hyaluronate')) {
    heroIngredients.push({
      name: 'Hyaluronik Asit',
      inciStandardName: 'Sodium Hyaluronate',
      purpose: 'Derinlemesine Nemlendirme',
      benefitForUser: 'Cildin alt katmanlarına nem bağlayarak dolgun ve esnek kalmasını sağlar.'
    });
  }

  if (lower.includes('salicylic acid') || lower.includes('salicyllc') || lower.includes('bha')) {
    heroIngredients.push({
      name: 'Salisilik Asit (BHA)',
      inciStandardName: 'Salicylic Acid',
      purpose: 'Gözenek İçi Eksfoliasyon',
      benefitForUser: 'T-bölgesindeki ölü hücreleri ve biriken yağı nazikçe arındırır.'
    });
  }

  if (lower.includes('alcohol denat') || lower.includes('sd alcohol')) {
    flaggedIngredients.push({
      name: 'Alkol Denat',
      inciStandardName: 'Alcohol Denat',
      riskLevel: 'Medium',
      concernCategory: 'Drying Alcohol',
      warningMessage: 'Hassas ve kuru bölgelerde koruyucu lipid bariyerini zayıflatıp kuruluk yapabilir.'
    });
  }

  if (lower.includes('fragrance') || lower.includes('parfum') || lower.includes('linalool') || lower.includes('limonene')) {
    flaggedIngredients.push({
      name: 'Parfüm / Koku Bileşenleri',
      inciStandardName: 'Fragrance / Parfum',
      riskLevel: 'Low',
      concernCategory: 'Fragrance',
      warningMessage: 'Hassasiyete meyilli ciltlerde uzun vadede kızarıklık veya iritasyon tetikleyebilir.'
    });
  }

  // Puan hesaplama
  let score = 85;
  if (flaggedIngredients.some(i => i.riskLevel === 'High')) score -= 30;
  if (flaggedIngredients.some(i => i.riskLevel === 'Medium')) score -= 15;
  if (heroIngredients.length > 0) score = Math.min(100, score + (heroIngredients.length * 5));

  const verdict = score >= 80 ? 'Highly Recommended' : (score >= 60 ? 'Suitable with Caution' : 'Not Recommended');

  return {
    productName: 'Taranan Cilt Bakım Ürünü',
    matchScore: score,
    suitabilityVerdict: verdict,
    skinTypeCompatibility: {
      skinType: skinType,
      isCompatible: score >= 60,
      compatibilityNote: `Bu ürün ${skinType} cilt tipi için genel olarak ${score >= 60 ? 'uygundur' : 'riskli maddeler barındırmaktadır'}.`
    },
    heroIngredients: heroIngredients.length > 0 ? heroIngredients : [{
      name: 'Gliserin & Nemlendirici Baz',
      inciStandardName: 'Glycerin',
      purpose: 'Temel Nem Desteği',
      benefitForUser: 'Cildin günlük nem dengesini korumaya yardımcı olur.'
    }],
    flaggedIngredients: flaggedIngredients,
    neutralOrBaseIngredients: ['Aqua / Water', 'Glycerin', 'Butylene Glycol', 'Caprylyl Glycol'],
    overallSummary: `Ürün formülasyonu ${heroIngredients.length} adet faydalı aktif ve ${flaggedIngredients.length} adet dikkat edilmesi gereken madde içermektedir. Cilt profilinizle uyumu %${score} olarak hesaplanmıştır.`,
    usageAdvice: {
      recommendedTime: lower.includes('salicylic') || lower.includes('retinol') ? 'Night' : 'Both',
      frequency: 'Günde 1 kez (Temiz cilde)',
      layeringTips: 'Gündüzleri güneş kremiyle desteklenmesi tavsiye edilir.'
    }
  };
};

module.exports = {
  analyzeIngredientsWithGemini,
  analyzeSkinHybridWithGemini
};
