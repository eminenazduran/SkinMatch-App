import React, { createContext, useContext, useState } from 'react';
import {
  IAnswerSelection,
  IComputedSkinProfileResult,
  calculateSkinProfile
} from '../data/quizQuestions';
import { submitQuizAnswersApi } from '../api/client';

interface SkinProfileContextType {
  profile: IComputedSkinProfileResult;
  quizAnswers: IAnswerSelection[];
  isSubmitting: boolean;
  hasCompletedQuiz: boolean;
  saveQuizResults: (answers: IAnswerSelection[]) => Promise<IComputedSkinProfileResult>;
}

const defaultProfile: IComputedSkinProfileResult = {
  skinType: 'Combination',
  barrierHealth: 'Compromised',
  barrierScore: 60,
  barrierBadgeTr: 'Dengelenme & Onarım Sürecinde',
  barrierBadgeEn: 'In Recovery & Balancing',
  primaryConcerns: ['Dehydration', 'Large Pores'],
  knownSensitivities: ['Alcohol Denat', 'Synthetic Fragrance', 'Essential Oils'],
  loveIngredients: ['Ceramides', 'Niacinamide', 'Hyaluronic Acid'],
  avoidIngredients: ['Alcohol Denat', 'Synthetic Fragrance', 'Essential Oils'],
};

const SkinProfileContext = createContext<SkinProfileContextType>({
  profile: defaultProfile,
  quizAnswers: [],
  isSubmitting: false,
  hasCompletedQuiz: false,
  saveQuizResults: async () => defaultProfile,
});

export const SkinProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<IComputedSkinProfileResult>(defaultProfile);
  const [quizAnswers, setQuizAnswers] = useState<IAnswerSelection[]>([]);
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

  return (
    <SkinProfileContext.Provider
      value={{
        profile,
        quizAnswers,
        isSubmitting,
        hasCompletedQuiz,
        saveQuizResults,
      }}
    >
      {children}
    </SkinProfileContext.Provider>
  );
};

export const useSkinProfile = () => useContext(SkinProfileContext);
