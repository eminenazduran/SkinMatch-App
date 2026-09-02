import { NavigatorScreenParams } from '@react-navigation/native';
import { IIngredientAnalysisResult } from '../types';

/**
 * Alt Menü (Bottom Tabs) Parametre Tipleri
 */
export type TabParamList = {
  HomeTab: undefined;
  ScannerTab: undefined;
  RoutineTab: undefined;
  ProfileTab: undefined;
};

/**
 * Ana Yığın (Root Stack) Parametre Tipleri
 */
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  ScannerModal: undefined;
  ProductResult: { result: IIngredientAnalysisResult };
  Quiz: undefined;
  SelfieAnalysis: undefined;
  IngredientDetail: { ingredientName: string };
};
