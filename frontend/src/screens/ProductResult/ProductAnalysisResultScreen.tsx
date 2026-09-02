import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import {
  Sparkles,
  Sun,
  Heart,
  FlaskConical,
  AlertTriangle,
  BookOpen
} from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/types';
import { useLanguage } from '../../context/LanguageContext';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';
import { shadows } from '../../theme/shadows';
import { IIngredientAnalysisResult } from '../../types';

interface Props {
  result?: IIngredientAnalysisResult;
  onReset?: () => void;
}

export const ProductAnalysisResultScreen: React.FC<Props> = ({
  result: propResult,
  onReset: propOnReset
}) => {
  const route = useRoute<RouteProp<RootStackParamList, 'ProductResult'>>();
  const navigation = useNavigation();
  const { t } = useLanguage();

  const result = propResult || route.params?.result;

  const handleBack = () => {
    if (propOnReset) {
      propOnReset();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const score = result?.matchScore ?? 92;
  const productName = result?.productName || 'Radiance Boost Vitamin C Serum';
  const brandName = result?.brand || 'BRAND X';
  const summary =
    result?.overallSummary ||
    'Cildine çok uygun. İçeriğindeki C vitamini bariyerini güçlendirirken, sivilce tetikleyici madde içermiyor.';

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Üst Bar: Geri Butonu, SkinMatch, Dil Butonu ve Bildirim Çanı */}
      <AppHeader showBack={true} onBack={handleBack} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Dairesel Uyum Skoru Kartı */}
        <View style={styles.scoreGaugeCard}>
          <View style={styles.gaugeOuterCircle}>
            <View style={styles.gaugeInnerCircle}>
              <Text style={styles.gaugeScoreText}>{score}%</Text>
              <Text style={styles.gaugeVerdictText}>{t('result_suitable')}</Text>
            </View>
          </View>
        </View>

        {/* 3. Ürün Bilgisi & AI Alıntısı Kartı */}
        <View style={styles.productInfoCard}>
          <Text style={styles.brandText}>{brandName.toUpperCase()}</Text>
          <Text style={styles.productTitle}>{productName}</Text>

          {/* AI Alıntı Kutusu */}
          <View style={styles.aiQuoteBox}>
            <Sparkles size={16} color={colors.primary} style={{ marginTop: 2 }} />
            <Text style={styles.aiQuoteText}>"{summary}"</Text>
          </View>

          {/* Aksiyon Butonları */}
          <TouchableOpacity style={styles.primaryAddBtn} activeOpacity={0.85}>
            <Sun size={16} color="#FFFFFF" />
            <Text style={styles.primaryAddBtnText}>{t('result_add_morning')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryFavBtn} activeOpacity={0.85}>
            <Heart size={16} color={colors.primary} />
            <Text style={styles.secondaryFavBtnText}>{t('result_add_favorites')}</Text>
          </TouchableOpacity>
        </View>

        {/* 4. Anahtar İçerikler (Hero Ingredients) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <FlaskConical size={18} color={colors.primary} />
            <Text style={styles.sectionHeaderTitle}>{t('result_key_ingredients')}</Text>
          </View>

          <View style={styles.ingredientsList}>
            <View style={styles.ingredientItemRow}>
              <View style={styles.ingredientInfo}>
                <Text style={styles.ingredientName}>Vitamin C</Text>
                <Text style={styles.ingredientFunction}>Aydınlatıcı & Antioksidan</Text>
              </View>
              <View style={styles.matchPillBlue}>
                <Text style={styles.matchPillBlueText}>{t('result_high_match')}</Text>
              </View>
            </View>

            <View style={styles.ingredientItemRow}>
              <View style={styles.ingredientInfo}>
                <Text style={styles.ingredientName}>Hyaluronic Acid</Text>
                <Text style={styles.ingredientFunction}>Nemlendirici</Text>
              </View>
              <View style={styles.matchPillBlue}>
                <Text style={styles.matchPillBlueText}>{t('result_safe')}</Text>
              </View>
            </View>

            <View style={styles.ingredientItemRow}>
              <View style={styles.ingredientInfo}>
                <Text style={styles.ingredientName}>Ferulic Acid</Text>
                <Text style={styles.ingredientFunction}>Stabilizatör</Text>
              </View>
              <View style={styles.matchPillBlue}>
                <Text style={styles.matchPillBlueText}>{t('result_safe')}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 5. Dikkat Edilmesi Gerekenler */}
        <View style={[styles.sectionCard, styles.flaggedCardBorder]}>
          <View style={styles.sectionHeaderRow}>
            <AlertTriangle size={18} color={colors.danger} />
            <Text style={styles.sectionHeaderTitle}>{t('result_flagged_title')}</Text>
          </View>

          <View style={styles.flaggedItemBox}>
            <View style={styles.flaggedTopRow}>
              <Text style={styles.flaggedName}>Fragrance</Text>
              <View style={styles.riskPill}>
                <Text style={styles.riskPillText}>{t('result_low_risk')}</Text>
              </View>
            </View>
            <Text style={styles.flaggedDescription}>
              {t('result_flagged_fragrance_desc')}
            </Text>
          </View>
        </View>

        {/* 6. Kullanım Rehberi */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <BookOpen size={18} color={colors.primary} />
            <Text style={styles.sectionHeaderTitle}>{t('result_usage_guide')}</Text>
          </View>

          <View style={styles.guideBox}>
            <View style={styles.guideIconCircle}>
              <Sun size={20} color={colors.primary} />
            </View>
            <View style={styles.guideTextWrapper}>
              <Text style={styles.guideTitle}>{t('result_usage_morning')}</Text>
              <Text style={styles.guideBody}>{t('result_usage_morning_desc')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  scoreGaugeCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  gaugeOuterCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 14,
    borderColor: '#EEF2FF',
    borderTopColor: colors.primary,
    borderRightColor: colors.primary,
    borderBottomColor: colors.primary,
    borderLeftColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-45deg' }],
  },
  gaugeInnerCircle: {
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
  },
  gaugeScoreText: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.primary,
  },
  gaugeVerdictText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2,
  },
  productInfoCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  brandText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  aiQuoteBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'flex-start',
  },
  aiQuoteText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  primaryAddBtn: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
    ...shadows.sm,
  },
  primaryAddBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryFavBtn: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryFavBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  flaggedCardBorder: {
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  ingredientsList: {
    gap: 10,
  },
  ingredientItemRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  ingredientFunction: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  matchPillBlue: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchPillBlueText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  flaggedItemBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  flaggedTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  flaggedName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  riskPill: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  riskPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.danger,
  },
  flaggedDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  guideBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 12,
  },
  guideIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideTextWrapper: {
    flex: 1,
  },
  guideTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  guideBody: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
