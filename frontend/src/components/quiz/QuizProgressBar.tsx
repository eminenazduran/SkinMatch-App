import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';

interface QuizProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabel?: string;
}

export const QuizProgressBar: React.FC<QuizProgressBarProps> = ({
  currentStep,
  totalSteps,
  stepLabel,
}) => {
  const progressPercent = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.stepText}>
          {stepLabel || `Soru ${currentStep} / ${totalSteps}`}
        </Text>
        <Text style={styles.percentText}>{Math.round(progressPercent)}%</Text>
      </View>

      <View style={styles.track}>
        <LinearGradient
          colors={['#4F46E5', '#7C3AED', '#A855F7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: `${progressPercent}%` }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  percentText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});
