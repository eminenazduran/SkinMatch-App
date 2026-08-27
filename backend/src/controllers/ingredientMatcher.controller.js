const crypto = require('crypto');
const ScanHistory = require('../models/ScanHistory');
const User = require('../models/User');
const { analyzeIngredientsWithGemini } = require('../services/gemini.service');
const { cleanOcrText, parseIngredientsList } = require('../services/ocr.service');
const { getCache, setCache } = require('../config/redis');

/**
 * @route   POST /api/ingredient-matcher/scan
 * @desc    OCR metnini veya görseli al, cilt profiliyle eşleştir ve AI analizi üret
 */
const scanAndAnalyzeIngredients = async (req, res, next) => {
  try {
    const { rawOcrText, productName, brand, userId, userProfileOverride } = req.body;

    if (!rawOcrText || rawOcrText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen taranan içerik metnini (INCI listesi) gönderin.'
      });
    }

    // 1. Kullanıcı profilini çek veya override verisini al
    let userProfile = userProfileOverride || {};
    let user = null;

    if (userId) {
      user = await User.findById(userId);
      if (user && user.skinProfile) {
        userProfile = {
          skinType: user.skinProfile.skinType,
          concerns: user.skinProfile.primaryConcerns,
          sensitivities: user.skinProfile.knownSensitivities
        };
      }
    }

    // 2. Önbellek Anahtarı Üret (Hash: rawText + skinType)
    const cacheKey = `inci_scan_${crypto.createHash('md5').update(rawOcrText + (userProfile.skinType || 'Normal')).digest('hex')}`;
    const cachedResult = await getCache(cacheKey);

    if (cachedResult) {
      return res.status(200).json({
        success: true,
        source: 'cache',
        data: cachedResult
      });
    }

    // 3. OCR Metnini Temizle ve Ayrıştır
    const cleanedText = cleanOcrText(rawOcrText);
    const parsedList = parseIngredientsList(cleanedText);

    // 4. Gemini AI Analizini Çalıştır (OCR Hata Toleranslı)
    const aiAnalysis = await analyzeIngredientsWithGemini(cleanedText, userProfile);
    if (productName && (!aiAnalysis.productName || aiAnalysis.productName === 'Scanned Product')) {
      aiAnalysis.productName = productName;
    }

    // 5. Tarama Geçmişine Kaydet
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
      console.warn('Veritabanına tarama geçmişi kaydedilemedi (Offline mod):', dbErr.message);
    }

    const responsePayload = {
      scanId: savedScan ? savedScan._id : null,
      productName: productName || aiAnalysis.productName,
      cleanedIngredients: parsedList,
      aiAnalysis: aiAnalysis
    };

    // 6. Önbelleğe Kaydet (24 Saat TTL)
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
 * @route   GET /api/ingredient-matcher/history
 * @desc    Kullanıcının tarama geçmişini getir
 */
const getScanHistory = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};

    const history = await ScanHistory.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  scanAndAnalyzeIngredients,
  getScanHistory
};
