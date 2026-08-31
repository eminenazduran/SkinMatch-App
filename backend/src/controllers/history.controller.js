const ScanHistory = require('../models/ScanHistory');

/**
 * @route   GET /api/history
 * @desc    Kullanıcının tarama geçmişini listele (filtreleme ve sayfalama destekli)
 */
const getScanHistory = async (req, res, next) => {
  try {
    const { userId, isFavorite, limit = 50, page = 1 } = req.query;

    const filter = {};
    if (userId) filter.userId = userId;
    if (isFavorite === 'true') filter.isFavorite = true;

    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const parsedPage = Math.max(1, parseInt(page, 10));
    const skip = (parsedPage - 1) * parsedLimit;

    const [history, totalCount] = await Promise.all([
      ScanHistory.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit),
      ScanHistory.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: history,
      pagination: {
        total: totalCount,
        page: parsedPage,
        limit: parsedLimit,
        pages: Math.ceil(totalCount / parsedLimit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/history/:id
 * @desc    Geçmişteki bir taramayı sil
 */
const deleteScanHistory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await ScanHistory.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Silinmek istenen tarama kaydı bulunamadı.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tarama kaydı başarıyla silindi.',
      deletedId: id
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/history/favorite/:id
 * @desc    Taranan ürünü favorilere ekle / çıkar
 */
const toggleFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;

    const scan = await ScanHistory.findById(id);
    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Tarama kaydı bulunamadı.'
      });
    }

    scan.isFavorite = !scan.isFavorite;
    await scan.save();

    res.status(200).json({
      success: true,
      message: scan.isFavorite ? 'Favorilere eklendi.' : 'Favorilerden çıkarıldı.',
      isFavorite: scan.isFavorite
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getScanHistory,
  deleteScanHistory,
  toggleFavorite
};
