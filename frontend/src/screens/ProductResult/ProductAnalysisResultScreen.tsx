import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { IIngredientAnalysisResult } from '../../types';

interface Props {
  result: IIngredientAnalysisResult;
  onReset: () => void;
}

export const ProductAnalysisResultScreen: React.FC<Props> = ({ result, onReset }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.primary;
    if (score >= 60) return colors.warning;
    return colors.danger;
  };

  const getVerdictLabel = (verdict: string) => {
    switch (verdict) {
      case 'Highly Recommended':
        return '🌟 Cildinize Çok Uygun';
      case 'Suitable with Caution':
        return '⚠️ Dikkatli Kullanılabilir';
      case 'Not Recommended':
        return '🚫 Tavsiye Edilmez';
      default:
        return verdict;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onReset} style={styles.backButton}>
            <Text style={styles.backButtonText}>‹ Yeni Tarama</Text>
          </TouchableOpacity>
          <Text style={styles.productTitle}>{result.productName || 'Taranan Ürün'}</Text>
        </View>

        {/* Uyum Skoru Kartı */}
        <View style={styles.scoreCard}>
          <View style={[styles.scoreBadge, { borderColor: getScoreColor(result.matchScore) }]}>
            <Text style={[styles.scoreText, { color: getScoreColor(result.matchScore) }]}>
              %{result.matchScore}
            </Text>
            <Text style={styles.scoreLabel}>Uyum Skoru</Text>
          </View>

          <View style={styles.verdictContainer}>
            <Text style={styles.verdictText}>{getVerdictLabel(result.suitabilityVerdict)}</Text>
            <Text style={styles.compatibilityNote}>
              {result.skinTypeCompatibility?.compatibilityNote || result.overallSummary}
            </Text>
          </View>
        </View>

        {/* Özet Kartı */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📋 Uzman Cilt Bakım Özeti</Text>
          <Text style={styles.summaryText}>{result.overallSummary}</Text>
        </View>

        {/* Kahraman Bileşenler (Hero Ingredients) */}
        {result.heroIngredients && result.heroIngredients.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>🌟 Öne Çıkan Faydalı Aktifler</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{result.heroIngredients.length}</Text>
              </View>
            </View>

            {result.heroIngredients.map((item, index) => (
              <View key={index} style={styles.heroCard}>
                <View style={styles.ingredientHeader}>
                  <Text style={styles.heroName}>{item.name}</Text>
                  {item.purpose && <Text style={styles.heroPurpose}>{item.purpose}</Text>}
                </View>
                <Text style={styles.heroBenefit}>💡 {item.benefitForUser}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Riskli / Dikkat Edilmesi Gereken Bileşenler */}
        {result.flaggedIngredients && result.flaggedIngredients.length > 0 && (
          <View style={[styles.sectionCard, styles.flaggedSectionCard]}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: colors.danger }]}>
                ⚠️ Dikkat Edilmesi Gereken Maddeler
              </Text>
              <View style={[styles.countBadge, { backgroundColor: colors.dangerBg }]}>
                <Text style={[styles.countBadgeText, { color: colors.danger }]}>
                  {result.flaggedIngredients.length}
                </Text>
              </View>
            </View>

            {result.flaggedIngredients.map((item, index) => (
              <View key={index} style={styles.flaggedCard}>
                <View style={styles.ingredientHeader}>
                  <Text style={styles.flaggedName}>{item.name}</Text>
                  <View style={[styles.riskTag, item.riskLevel === 'High' ? styles.riskHigh : styles.riskMedium]}>
                    <Text style={styles.riskTagText}>{item.riskLevel} Risk</Text>
                  </View>
                </View>
                <Text style={styles.flaggedWarning}>⚡ {item.warningMessage}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Kullanım ve Rutin Tavsiyesi */}
        {result.usageAdvice && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>🕒 Kullanım & Sıralama Rehberi</Text>
            <View style={styles.adviceRow}>
              <Text style={styles.adviceLabel}>Önerilen Zaman:</Text>
              <Text style={styles.adviceValue}>
                {result.usageAdvice.recommendedTime === 'Morning' ? '☀️ Sabah' : 
                 result.usageAdvice.recommendedTime === 'Night' ? '🌙 Akşam' : '☀️/🌙 Sabah & Akşam'}
              </Text>
            </View>
            <View style={styles.adviceRow}>
              <Text style={styles.adviceLabel}>Uygulama Sıklığı:</Text>
              <Text style={styles.adviceValue}>{result.usageAdvice.frequency}</Text>
            </View>
            {result.usageAdvice.layeringTips && (
              <Text style={styles.layeringText}>💡 {result.usageAdvice.layeringTips}</Text>
            )}
          </View>
        )}

        {/* Aksiyon Butonları */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.routineButton}>
            <Text style={styles.routineButtonText}>☀️ Sabah Rutinime Ekle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.routineButton, styles.nightRoutineButton]}>
            <Text style={styles.routineButtonText}>🌙 Akşam Rutinime Ekle</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 8,
    marginBottom: 4,
  },
  backButtonText: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  productTitle: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  scoreCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  scoreBadge: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  scoreText: {
    fontSize: 22,
    fontWeight: '800',
  },
  scoreLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  verdictContainer: {
    flex: 1,
  },
  verdictText: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  compatibilityNote: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  flaggedSectionCard: {
    borderColor: '#FEE2E2',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  countBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countBadgeText: {
    ...typography.badge,
    color: colors.primaryDark,
  },
  summaryText: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
    marginTop: 6,
  },
  heroCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  ingredientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  heroName: {
    ...typography.bodyBold,
    color: colors.primaryDark,
  },
  heroPurpose: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  heroBenefit: {
    ...typography.caption,
    color: colors.textPrimary,
    marginTop: 2,
  },
  flaggedCard: {
    backgroundColor: colors.dangerBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  flaggedName: {
    ...typography.bodyBold,
    color: colors.danger,
  },
  riskTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  riskHigh: {
    backgroundColor: colors.danger,
  },
  riskMedium: {
    backgroundColor: colors.warning,
  },
  riskTagText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  flaggedWarning: {
    ...typography.caption,
    color: colors.textPrimary,
    marginTop: 2,
  },
  adviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  adviceLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  adviceValue: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  layeringText: {
    ...typography.caption,
    color: colors.textPrimary,
    marginTop: 10,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  routineButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  nightRoutineButton: {
    backgroundColor: '#334155',
  },
  routineButtonText: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
