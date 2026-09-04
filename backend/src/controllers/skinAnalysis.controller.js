const User = require('../models/User');
const { analyzeSkinHybridWithGemini } = require('../services/gemini.service');

/**
 * @route   POST /api/skin-analysis/quiz
 * @desc    Dinamik anket cevaplarını kaydet ve ön cilt skoru hesapla
 */
const submitQuizAnswers = async (req, res, next) => {
  try {
    const { userId, answers, computedProfile } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen geçerli anket cevapları gönderin.'
      });
    }

    let user = null;
    if (userId) {
      user = await User.findById(userId);
    }

    if (!user) {
      user = new User({
        skinProfile: {
          quizAnswers: answers,
          lastAnalysisDate: new Date()
        }
      });
    } else {
      user.skinProfile.quizAnswers = answers;
      user.skinProfile.lastAnalysisDate = new Date();
    }

    if (computedProfile) {
      if (computedProfile.skinType) user.skinProfile.skinType = computedProfile.skinType;
      if (computedProfile.barrierHealth) user.skinProfile.barrierHealth = computedProfile.barrierHealth;
      if (computedProfile.primaryConcerns) user.skinProfile.primaryConcerns = computedProfile.primaryConcerns;
      if (computedProfile.knownSensitivities) user.skinProfile.knownSensitivities = computedProfile.knownSensitivities;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Anket cevapları başarıyla kaydedildi.',
      data: {
        userId: user._id,
        quizAnswersCount: answers.length,
        skinProfile: user.skinProfile
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/skin-analysis/selfie
 * @desc    Selfie metrikleri + Anket cevapları ile hibrit cilt tipi analizi yap
 */
const processSelfieAnalysis = async (req, res, next) => {
  try {
    const { userId, photoUrl, photoBase64, metrics = {} } = req.body;

    let user = null;
    if (userId) {
      user = await User.findById(userId);
    }

    const quizAnswers = user?.skinProfile?.quizAnswers || [];

    // Gemini Hybrid Analizini Çağır (Gerçek Fotoğraf + Anket Sentezi)
    const analysisResult = await analyzeSkinHybridWithGemini(quizAnswers, metrics, photoBase64);

    if (user) {
      user.skinProfile.skinType = analysisResult.determinedSkinType || 'Combination';
      user.skinProfile.barrierHealth = analysisResult.barrierHealth || 'Healthy';
      user.skinProfile.primaryConcerns = analysisResult.detectedConcerns || [];
      user.skinProfile.knownSensitivities = analysisResult.ingredientsToAvoid || [];
      user.skinProfile.selfieAnalysis = {
        photoUrl: photoUrl || '',
        oilinessScore: metrics.oilinessScore || 50,
        rednessScore: metrics.rednessScore || 10,
        poreScore: metrics.poreScore || 30,
        aiInsights: analysisResult.analysisSummary,
        analyzedAt: new Date()
      };
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Hibrit cilt analizi başarıyla tamamlandı.',
      data: {
        userId: user?._id,
        analysis: analysisResult
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/skin-analysis/profile/:userId
 * @desc    Kullanıcının mevcut cilt profilini getir
 */
const getUserSkinProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı.'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        skinProfile: user.skinProfile,
        savedRoutines: user.savedRoutines
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitQuizAnswers,
  processSelfieAnalysis,
  getUserSkinProfile
};
