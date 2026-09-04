import axios from 'axios';
import { Platform } from 'react-native';

// Bilgisayarın yerel ağ IP'si (Fiziksel telefonda Expo Go ile test ederken gereklidir)
const DEV_MACHINE_IP = '192.168.0.126';

const BASE_URL = Platform.select({
  web: 'http://localhost:5000/api',
  android: `http://${DEV_MACHINE_IP}:5000/api`,
  ios: `http://${DEV_MACHINE_IP}:5000/api`,
  default: `http://${DEV_MACHINE_IP}:5000/api`,
});

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 45000, // Gemini AI görme analizleri için geniş zaman aşımı
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

export const processSelfieAnalysisApi = async (
  photoUrl: string,
  metrics: { oilinessScore: number; rednessScore: number; poreScore: number },
  userId?: string,
  photoBase64?: string
) => {
  const response = await apiClient.post('/skin-analysis/selfie', {
    photoUrl,
    photoBase64,
    metrics,
    userId
  });
  return response.data;
};
