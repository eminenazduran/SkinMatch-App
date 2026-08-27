import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { ScannerScreen } from './src/screens/Scanner/ScannerScreen';
import { ProductAnalysisResultScreen } from './src/screens/ProductResult/ProductAnalysisResultScreen';
import { IIngredientAnalysisResult } from './src/types';

export default function App() {
  const [currentResult, setCurrentResult] = useState<IIngredientAnalysisResult | null>(null);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {currentResult ? (
        <ProductAnalysisResultScreen
          result={currentResult}
          onReset={() => setCurrentResult(null)}
        />
      ) : (
        <ScannerScreen
          onScanComplete={(result) => setCurrentResult(result)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
});
