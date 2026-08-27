const User = require('../models/User');

/**
 * @route   GET /api/routine/dashboard
 * @desc    Günlük UV indeksi, çevre uyarısı ve aktif rutinleri getir
 */
const getDashboardData = async (req, res, next) => {
  try {
    const { userId, latitude, longitude } = req.query;

    // UV & Çevresel Simülasyon Verisi
    const uvIndex = 6.4; // Orta-Yüksek
    const environmentalTips = {
      uvIndex: uvIndex,
      uvRiskLevel: 'High',
      recommendation: 'Güneş ışınları bugün kuvvetli. Dışarı çıkmadan 15 dakika önce en az SPF 50 geniş spektrumlu güneş koruyucu uygulayın ve her 2 saatte bir yenileyin!',
      humidity: '48%',
      airQuality: 'Good',
      barrierAdvice: 'Hava nem seviyesi dengeli. Hafif bir nemlendirici bariyerinizi korumak için yeterlidir.'
    };

    let userRoutines = { morning: [], evening: [] };
    if (userId) {
      const user = await User.findById(userId);
      if (user && user.savedRoutines) {
        userRoutines = user.savedRoutines;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        environmental: environmentalTips,
        routines: userRoutines
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/routine/save-product
 * @desc    Ürünü sabah veya akşam rutinine ekle
 */
const saveProductToRoutine = async (req, res, next) => {
  try {
    const { userId, timeOfDay, productName, brand, category, matchScore } = req.body;

    if (!timeOfDay || !['morning', 'evening'].includes(timeOfDay.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "timeOfDay 'morning' veya 'evening' olmalıdır."
      });
    }

    if (!productName) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen ürün adını belirtin.'
      });
    }

    let user = null;
    if (userId) {
      user = await User.findById(userId);
    }

    const newProduct = {
      productName,
      brand: brand || '',
      category: category || 'Other',
      matchScore: matchScore || 85,
      addedAt: new Date()
    };

    if (user) {
      const routineKey = timeOfDay.toLowerCase();
      user.savedRoutines[routineKey].push(newProduct);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: `Ürün ${timeOfDay === 'morning' ? 'Sabah' : 'Akşam'} rutinine başarıyla eklendi.`,
      data: newProduct
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData,
  saveProductToRoutine
};
