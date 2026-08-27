/**
 * SkinMatch App TypeScript Tipleri ve Arayüzleri
 */

export type SkinType = 'Oily' | 'Dry' | 'Combination' | 'Normal' | 'Sensitive' | 'Not Determined';
export type BarrierHealthStatus = 'Healthy' | 'Compromised' | 'Needs Repair' | 'Unknown';

export interface ISkinProfile {
  skinType: SkinType;
  barrierHealth: BarrierHealthStatus;
  primaryConcerns: string[];
  knownSensitivities: string[];
  lastAnalysisDate?: string;
}

export interface IHeroIngredient {
  name: string;
  inciStandardName: string;
  purpose: string;
  benefitForUser: string;
}

export interface IFlaggedIngredient {
  name: string;
  inciStandardName: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  concernCategory: 'Irritant' | 'Comedogenic' | 'Allergen' | 'Drying Alcohol' | 'Fragrance' | 'Other';
  warningMessage: string;
}

export interface IIngredientAnalysisResult {
  productName: string;
  matchScore: number; // 0 - 100
  suitabilityVerdict: 'Highly Recommended' | 'Suitable with Caution' | 'Not Recommended';
  skinTypeCompatibility: {
    skinType: string;
    isCompatible: boolean;
    compatibilityNote: string;
  };
  heroIngredients: IHeroIngredient[];
  flaggedIngredients: IFlaggedIngredient[];
  neutralOrBaseIngredients: string[];
  overallSummary: string;
  usageAdvice: {
    recommendedTime: 'Morning' | 'Night' | 'Both' | 'Not Recommended';
    frequency: string;
    layeringTips: string;
  };
}

export interface IRoutineProduct {
  id?: string;
  productName: string;
  brand?: string;
  category: string;
  matchScore?: number;
  addedAt?: string;
}

export interface IEnvironmentalData {
  uvIndex: number;
  uvRiskLevel: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';
  recommendation: string;
  humidity: string;
  airQuality: string;
  barrierAdvice: string;
}
