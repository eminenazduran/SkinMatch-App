import axios from 'axios';

// Emülatör veya yerel sunucu bağlantısı
// Android Emülatör için: 'http://10.0.2.2:5000/api'
// iOS / Web için: 'http://localhost:5000/api'
const BASE_URL = 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 35000, // AI analizleri için geniş zaman aşımı
  headers: {
    'Content-Type': 'application/json',
  },
});

export const scanIngredientsApi = async (rawOcrText: string, productName?: string, userProfile?: any) => {
  const response = await apiClient.post('/ingredient-matcher/scan', {
    rawOcrText,
    productName,
    userProfileOverride: userProfile
  });
  return response.data;
};

export const fetchDashboardApi = async (userId?: string) => {
  const response = await apiClient.get('/routine/dashboard', {
    params: { userId }
  });
  return response.data;
};

export const submitQuizAnswersApi = async (answers: any[], computedProfile?: any, userId?: string) => {
  const response = await apiClient.post('/skin-analysis/quiz', {
    answers,
    computedProfile,
    userId
  });
  return response.data;
};
