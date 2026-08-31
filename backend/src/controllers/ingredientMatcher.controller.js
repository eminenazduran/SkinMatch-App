const crypto = require('crypto');
const ScanHistory = require('../models/ScanHistory');
const User = require('../models/User');
const { analyzeIngredientsWithGemini } = require('../services/gemini.service');
const { cleanOcrText, parseIngredientsList, generateInciCacheKey } = require('../services/ocr.service');
const { getCache, setCache } = require('../config/redis');
const CosIngService = require('../services/cosing.service');
const OpenBeautyFactsService = require('../services/openBeautyFacts.service');

/**
 * @route   POST /api/ingredient-matcher/scan
 * @desc    OCR metnini veya barkodu al, cilt profiliyle eşleştir ve AI analizi üret
 */
const scanAndAnalyzeIngredients = async (req, res, next) => {
  try {
    let { rawOcrText, barcode, productName, brand, userId, userProfileOverride } = req.body;

    // 1. Eğer barkod gönderilmişse ve rawOcrText yoksa, Open Beauty Facts'ten çek
    if (barcode && (!rawOcrText || rawOcrText.trim().length === 0)) {
      const obfProduct = await OpenBeautyFactsService.getProductByBarcode(barcode);
      if (obfProduct && obfProduct.rawIngredientsText) {
        rawOcrText = obfProduct.rawIngredientsText;
        if (!productName || productName === 'Unknown Product') productName = obfProduct.productName;
        if (!brand) brand = obfProduct.brand;
      }
    }

    if (!rawOcrText || rawOcrText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen taranan içerik metnini (INCI listesi) veya geçerli bir ürün barkodu gönderin.'
      });
    }

    // 2. Kullanıcı profilini çek veya override verisini al
    let userProfile = userProfileOverride || {};
    let user = null;

    if (userId) {
      try {
        user = await User.findById(userId);
        if (user && user.skinProfile) {
          userProfile = {
            skinType: user.skinProfile.skinType,
            concerns: user.skinProfile.primaryConcerns,
            sensitivities: user.skinProfile.knownSensitivities
          };
        }
      } catch (userErr) {
        // Devam et (misafir kullanıcı modu)
      }
    }

    // 3. Önbellek Anahtarı Üret ve Kontrol Et
    const cacheKey = generateInciCacheKey(rawOcrText, userProfile.skinType || 'Normal');
    const cachedResult = await getCache(cacheKey);

    if (cachedResult) {
      return res.status(200).json({
        success: true,
        source: 'cache',
        data: cachedResult
      });
    }

    // 4. OCR Metnini Temizle ve Ayrıştır
    const cleanedText = cleanOcrText(rawOcrText);
    const parsedList = parseIngredientsList(cleanedText);

    // 5. EU CosIng veritabanından bileşenleri zenginleştir
    const enrichedList = await CosIngService.enrichIngredientsList(parsedList);

    // 6. Gemini AI Analizini Çalıştır (OCR Hata Toleranslı)
    const aiAnalysis = await analyzeIngredientsWithGemini(cleanedText, userProfile);
    if (productName && (!aiAnalysis.productName || aiAnalysis.productName === 'Scanned Product' || aiAnalysis.productName === 'Taranan Cilt Bakım Ürünü')) {
      aiAnalysis.productName = productName;
    }

    // 7. Tarama Geçmişine Kaydet
    let savedScan = null;
    try {
      savedScan = await ScanHistory.create({
        userId: user ? user._id : undefined,
        productName: productName || aiAnalysis.productName || 'Taranan Ürün',
        brand: brand || '',
        rawOcrText: rawOcrText,
        cleanedIngredients: parsedList,
        userProfileSnapshot: userProfile,
        aiAnalysis: aiAnalysis
      });
    } catch (dbErr) {
      console.warn('Tarama geçmişi veritabanına kaydedilemedi:', dbErr.message);
    }

    const responsePayload = {
      scanId: savedScan ? savedScan._id : null,
      productName: productName || aiAnalysis.productName,
      brand: brand || '',
      cleanedIngredients: parsedList,
      enrichedIngredients: enrichedList,
      aiAnalysis: aiAnalysis
    };

    // 8. Önbelleğe Kaydet (24 Saat TTL)
    await setCache(cacheKey, responsePayload, 86400);

    res.status(200).json({
      success: true,
      source: 'ai_engine',
      data: responsePayload
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/ingredient-matcher/ingredient/:name
 * @desc    Belirli bir bileşenin adını EU CosIng sözlüğünden getir
 */
const getIngredientDetails = async (req, res, next) => {
  try {
    const { name } = req.params;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen geçerli bir bileşen adı belirtin.'
      });
    }

    const ingredient = await CosIngService.findStandardIngredient(name);

    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: `'${name}' adına sahip bileşen sözlükte bulunamadı.`
      });
    }

    res.status(200).json({
      success: true,
      data: ingredient
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/ingredient-matcher/barcode/:barcode
 * @desc    Barkod ile Open Beauty Facts üzerinden ürün sorgula
 */
const getProductByBarcode = async (req, res, next) => {
  try {
    const { barcode } = req.params;

    if (!barcode) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen ürün barkod numarasını belirtin.'
      });
    }

    const product = await OpenBeautyFactsService.getProductByBarcode(barcode);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Bu barkoda ait ürün bulunamadı.'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  scanAndAnalyzeIngredients,
  getIngredientDetails,
  getProductByBarcode
};
