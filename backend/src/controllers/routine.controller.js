const User = require('../models/User');

/**
 * @route   GET /api/routine/dashboard
 * @desc    Günlük UV indeksi, çevre uyarısı ve aktif rutinleri getir
 */
const getDashboardData = async (req, res, next) => {
  try {
    const { userId } = req.query;

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
      try {
        const user = await User.findById(userId);
        if (user && user.savedRoutines) {
          userRoutines = user.savedRoutines;
        }
      } catch (userErr) {
        // Devam et
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

    if (!productName || productName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen ürün adını belirtin.'
      });
    }

    let user = null;
    if (userId) {
      try {
        user = await User.findById(userId);
      } catch (err) {
        // Misafir
      }
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

/**
 * @route   DELETE /api/routine/product
 * @desc    Ürünü rutinden çıkar
 */
const removeProductFromRoutine = async (req, res, next) => {
  try {
    const { userId, timeOfDay, productName } = req.body;

    if (!userId || !timeOfDay || !productName) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen userId, timeOfDay ve productName parametrelerini gönderin.'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı.'
      });
    }

    const routineKey = timeOfDay.toLowerCase();
    if (user.savedRoutines && user.savedRoutines[routineKey]) {
      user.savedRoutines[routineKey] = user.savedRoutines[routineKey].filter(
        p => p.productName !== productName
      );
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Ürün rutinden kaldırıldı.',
      data: user.savedRoutines
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData,
  saveProductToRoutine,
  removeProductFromRoutine
};
