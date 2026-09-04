const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;

let genAI = null;

if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  genAI = new GoogleGenerativeAI(apiKey);
  console.log('✅ Google Gemini AI İstemcisi Başlatıldı.');
} else {
  console.warn('⚠️ GEMINI_API_KEY tanımlanmamış veya varsayılan değerde. AI analizleri akıllı simülasyon modunda çalışacak.');
}

const getGeminiModel = (modelName = process.env.GEMINI_MODEL || 'gemini-flash-latest') => {
  if (!genAI) return null;
  return genAI.getGenerativeModel({ model: modelName });
};

module.exports = {
  genAI,
  getGeminiModel
};
