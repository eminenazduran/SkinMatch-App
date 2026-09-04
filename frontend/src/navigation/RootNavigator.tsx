import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { AppTabsNavigator } from './AppTabsNavigator';
import { ScannerScreen } from '../screens/Scanner/ScannerScreen';
import { ProductAnalysisResultScreen } from '../screens/ProductResult/ProductAnalysisResultScreen';
import { QuizScreen } from '../screens/Quiz/QuizScreen';
import { SelfieScreen } from '../screens/SkinAnalysis/SelfieScreen';
import { SkinProfileResultScreen } from '../screens/SkinAnalysis/SkinProfileResultScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={AppTabsNavigator} />
      <Stack.Screen
        name="ScannerModal"
        component={ScannerScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="ProductResult"
        component={ProductAnalysisResultScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="SelfieAnalysis"
        component={SelfieScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="SkinProfileResult"
        component={SkinProfileResultScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};
