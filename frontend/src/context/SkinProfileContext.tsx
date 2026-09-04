import React, { createContext, useContext, useState } from 'react';
import {
  IAnswerSelection,
  IComputedSkinProfileResult,
  calculateSkinProfile
} from '../data/quizQuestions';
import { submitQuizAnswersApi } from '../api/client';

export interface ISelfieMetrics {
  oilinessScore: number;
  rednessScore: number;
  poreScore: number;
}

export interface IHybridSkinAnalysis {
  determinedSkinType: string;
  barrierHealth: string;
  oilinessLevel?: string;
  sensitivityRisk?: string;
  detectedConcerns?: string[];
  analysisSummary?: string;
  keyRecommendations?: string[];
  ingredientsToLookFor?: string[];
  ingredientsToAvoid?: string[];
}

interface SkinProfileContextType {
  profile: IComputedSkinProfileResult;
  quizAnswers: IAnswerSelection[];
  selfiePhotoUri: string | null;
  selfieMetrics: ISelfieMetrics | null;
  hybridAnalysis: IHybridSkinAnalysis | null;
  isSubmitting: boolean;
  hasCompletedQuiz: boolean;
  isAnalyzed: boolean;
  saveQuizResults: (answers: IAnswerSelection[]) => Promise<IComputedSkinProfileResult>;
  saveHybridAnalysis: (
    analysisResult: IHybridSkinAnalysis,
    photoUri?: string,
    metrics?: ISelfieMetrics
  ) => void;
}

const defaultProfile: IComputedSkinProfileResult = {
  skinType: 'Not Determined',
  barrierHealth: 'Unknown',
  barrierScore: 0,
  barrierBadgeTr: 'Henüz Analiz Edilmedi',
  barrierBadgeEn: 'Not Yet Analyzed',
  primaryConcerns: [],
  knownSensitivities: [],
  loveIngredients: [],
  avoidIngredients: [],
};

const SkinProfileContext = createContext<SkinProfileContextType>({
  profile: defaultProfile,
  quizAnswers: [],
  selfiePhotoUri: null,
  selfieMetrics: null,
  hybridAnalysis: null,
  isSubmitting: false,
  hasCompletedQuiz: false,
  isAnalyzed: false,
  saveQuizResults: async () => defaultProfile,
  saveHybridAnalysis: () => {},
});

export const SkinProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<IComputedSkinProfileResult>(defaultProfile);
  const [quizAnswers, setQuizAnswers] = useState<IAnswerSelection[]>([]);
  const [selfiePhotoUri, setSelfiePhotoUri] = useState<string | null>(null);
  const [selfieMetrics, setSelfieMetrics] = useState<ISelfieMetrics | null>(null);
  const [hybridAnalysis, setHybridAnalysis] = useState<IHybridSkinAnalysis | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState<boolean>(false);

  const saveQuizResults = async (answers: IAnswerSelection[]): Promise<IComputedSkinProfileResult> => {
    setIsSubmitting(true);
    try {
      // 1. Klinik Mantık Ağacı Puanlama Motorunu Çalıştır
      const computedResult = calculateSkinProfile(answers);

      // 2. Yerel State'i güncelle
      setProfile(computedResult);
      setQuizAnswers(answers);
      setHasCompletedQuiz(true);

      // 3. Backend REST API'ye Gönder
      try {
        await submitQuizAnswersApi(answers, computedResult);
      } catch (apiErr) {
        console.warn('⚠️ Quiz cevapları backend API senkronizasyonu uyarısı (yerel profil korundu):', apiErr);
      }

      return computedResult;
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveHybridAnalysis = (
    analysisResult: IHybridSkinAnalysis,
    photoUri?: string,
    metrics?: ISelfieMetrics
  ) => {
    if (photoUri) setSelfiePhotoUri(photoUri);
    if (metrics) setSelfieMetrics(metrics);
    setHybridAnalysis(analysisResult);

    // Profile state'ini hibrit analiz sonuçları ile senkronize et
    const validSkinType = (analysisResult.determinedSkinType as any) || profile.skinType;
    const validBarrierHealth = (analysisResult.barrierHealth as any) || profile.barrierHealth;

    // Metriklere göre bariyer skoru revize et
    let calculatedBarrierScore = profile.barrierScore;
    if (metrics) {
      calculatedBarrierScore = Math.max(
        35,
        Math.min(95, 95 - Math.round(metrics.rednessScore * 0.45 + (metrics.oilinessScore > 70 ? 15 : 0)))
      );
    }

    setProfile((prev) => ({
      ...prev,
      skinType: validSkinType,
      barrierHealth: validBarrierHealth,
      barrierScore: calculatedBarrierScore,
      primaryConcerns: analysisResult.detectedConcerns || prev.primaryConcerns,
      loveIngredients: analysisResult.ingredientsToLookFor || prev.loveIngredients,
      avoidIngredients: analysisResult.ingredientsToAvoid || prev.avoidIngredients,
    }));
  };

  return (
    <SkinProfileContext.Provider
      value={{
        profile,
        quizAnswers,
        selfiePhotoUri,
        selfieMetrics,
        hybridAnalysis,
        isSubmitting,
        hasCompletedQuiz,
        isAnalyzed: hasCompletedQuiz || hybridAnalysis !== null,
        saveQuizResults,
        saveHybridAnalysis,
      }}
    >
      {children}
    </SkinProfileContext.Provider>
  );
};

export const useSkinProfile = () => useContext(SkinProfileContext);
