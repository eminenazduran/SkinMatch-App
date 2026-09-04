/**
 * Gemini AI Yapılandırılmış Yanıt Şemaları ve TypeScript/JS Formatları
 */

const INGREDIENT_ANALYSIS_SCHEMA_PROMPT = `
Lütfen yanıtını SADECE ve KESİNLİKLE aşağıdaki geçerli JSON formatında ver. Markdown kod blokları veya ekstra açıklama yazma:
{
  "productName": "Tespit edilen veya genel ürün adı",
  "matchScore": 85,
  "suitabilityVerdict": "Highly Recommended",
  "skinTypeCompatibility": {
    "skinType": "Oily",
    "isCompatible": true,
    "compatibilityNote": "Bu ürün kullanıcının cilt tipine uygun hafif su bazlı içerikler barındırıyor."
  },
  "heroIngredients": [
    {
      "name": "Niacinamide",
      "inciStandardName": "Niacinamide",
      "purpose": "Sebum dengeleme & Gözenek sıkılaştırma",
      "benefitForUser": "Yağlı T-bölgenizdeki aşırı parlamayı kontrol altına alır ve cilt tonunu eşitler."
    }
  ],
  "flaggedIngredients": [
    {
      "name": "Alcohol Denat",
      "inciStandardName": "Alcohol Denat",
      "riskLevel": "Medium",
      "concernCategory": "Drying Alcohol",
      "warningMessage": "Hassas yanak bölgelerinde kuruluk veya hafif gerginlik hissi yaratabilir."
    }
  ],
  "neutralOrBaseIngredients": ["Aqua", "Glycerin", "Butylene Glycol"],
  "overallSummary": "Genel olarak cilt tipinizle oldukça uyumlu bir formül. İçerisindeki aktifler hedeflerinizi destekliyor.",
  "usageAdvice": {
    "recommendedTime": "Both",
    "frequency": "Günde 1 veya 2 kez",
    "layeringTips": "Temizlenmiş cilde nemlendiriciden hemen önce birkaç damla uygulayın."
  }
}
`;

const SKIN_HYBRID_ANALYSIS_SCHEMA_PROMPT = `
Lütfen yanıtını SADECE ve KESİNLİKLE aşağıdaki geçerli JSON formatında ver:
{
  "determinedSkinType": "Combination",
  "barrierHealth": "Healthy",
  "oilinessScore": 55,
  "rednessScore": 25,
  "poreScore": 40,
  "oilinessLevel": "Moderate T-Zone Shine",
  "sensitivityRisk": "Low",
  "detectedConcerns": ["Enlarged Pores", "Occasional Breakouts"],
  "analysisSummary": "Anket yanıtlarınız ve yüz görseliniz karma bir cilt yapısına işaret ediyor. T-bölgeniz yağlanmaya meyilliyken yanaklarınız dengelidir.",
  "keyRecommendations": [
    "Hafif jel bazlı temizleyiciler tercih edin",
    "Salisilik asit veya Niasinamid içeren serumlar kullanın",
    "Gündüzleri gözenek tıkamayan hafif bir SPF 50 güneş kremi uygulayın"
  ],
  "ingredientsToLookFor": ["Niacinamide", "Hyaluronic Acid", "Centella Asiatica", "Zinc PCA"],
  "ingredientsToAvoid": ["Heavy Mineral Oils", "Synthetic Fragrance", "High Percentage Alcohol Denat"]
}
`;

module.exports = {
  INGREDIENT_ANALYSIS_SCHEMA_PROMPT,
  SKIN_HYBRID_ANALYSIS_SCHEMA_PROMPT
};
