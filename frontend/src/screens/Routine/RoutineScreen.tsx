import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  AlertTriangle,
  GripVertical,
  Droplet,
  FlaskConical,
  Sparkles,
  Layers,
  Check,
  Calendar,
  Sparkle
} from 'lucide-react-native';
import { useLanguage } from '../../context/LanguageContext';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';

type RoutineTabType = 'morning' | 'evening';

export const RoutineScreen: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<RoutineTabType>('morning');
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  return (
    <View style={styles.container}>
      {/* 1. Üst Bar: Avatar, SkinMatch, Dil Butonu ve Bildirim Çanı */}
      <SafeAreaView edges={['top']} style={styles.topSafeArea}>
        <AppHeader />
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Başlık ve Rutin İlerleme Özeti */}
        <View style={styles.heroHeader}>
          <View>
            <Text style={styles.pageTitle}>{t('routine_title')}</Text>
            <Text style={styles.pageSubtitle}>
              {completedSteps.length} / 4 Adım tamamlandı • Harika gidiyorsun!
            </Text>
          </View>
          <View style={styles.progressCircleContainer}>
            <Text style={styles.progressPercentText}>
              %{Math.round((completedSteps.length / 4) * 100)}
            </Text>
          </View>
        </View>

        {/* 3. Sabah / Akşam Segment Seçici */}
        <View style={styles.segmentedContainer}>
          <TouchableOpacity
            style={[styles.segmentButton, activeTab === 'morning' && styles.segmentButtonActive]}
            onPress={() => setActiveTab('morning')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, activeTab === 'morning' && styles.segmentTextActive]}>
              {t('routine_morning')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentButton, activeTab === 'evening' && styles.segmentButtonActive]}
            onPress={() => setActiveTab('evening')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, activeTab === 'evening' && styles.segmentTextActive]}>
              {t('routine_evening')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 4. Çatışma Uyarısı (Akıllı Dermatoloji Uyarısı) */}
        <View style={styles.conflictCard}>
          <View style={styles.conflictIconCircle}>
            <AlertTriangle size={18} color="#DC2626" />
          </View>
          <View style={styles.conflictTextWrapper}>
            <Text style={styles.conflictTitle}>{t('routine_conflict_title')}</Text>
            <Text style={styles.conflictBody}>{t('routine_conflict_desc')}</Text>
          </View>
        </View>

        {/* 5. Dikey Zaman Çizelgesi (Stepper & Timeline) */}
        <View style={styles.timelineContainer}>
          {/* Bağlantı Çizgisi */}
          <View style={styles.timelineVerticalLine} />

          {/* Adım 1: Cleanser */}
          <View style={styles.timelineStepRow}>
            <TouchableOpacity
              onPress={() => toggleStep(1)}
              style={[
                styles.stepCircleBadge,
                completedSteps.includes(1) && styles.stepCircleBadgeCompleted
              ]}
              activeOpacity={0.8}
            >
              {completedSteps.includes(1) ? (
                <Check size={14} color="#FFFFFF" />
              ) : (
                <Text style={styles.stepCircleNumber}>1</Text>
              )}
            </TouchableOpacity>

            <View style={styles.productCard}>
              <View style={styles.productThumbnail}>
                <Droplet size={20} color="#4F46E5" />
              </View>

              <View style={styles.productDetails}>
                <View style={styles.tagRow}>
                  <Text style={styles.categoryTag}>{t('routine_cat_cleanser')}</Text>
                  <View style={styles.matchPill}>
                    <Text style={styles.matchPillText}>98% {t('routine_match_suffix')}</Text>
                  </View>
                </View>
                <Text style={styles.productName}>Gentle Hydrating Cleanser</Text>
                <Text style={styles.brandName}>CeraVe</Text>
              </View>

              <GripVertical size={18} color="#CBD5E1" />
            </View>
          </View>

          {/* Adım 2: Toner */}
          <View style={styles.timelineStepRow}>
            <TouchableOpacity
              onPress={() => toggleStep(2)}
              style={[
                styles.stepCircleBadge,
                completedSteps.includes(2) && styles.stepCircleBadgeCompleted
              ]}
              activeOpacity={0.8}
            >
              {completedSteps.includes(2) ? (
                <Check size={14} color="#FFFFFF" />
              ) : (
                <Text style={styles.stepCircleNumber}>2</Text>
              )}
            </TouchableOpacity>

            <View style={styles.productCard}>
              <View style={styles.productThumbnail}>
                <FlaskConical size={20} color="#4F46E5" />
              </View>

              <View style={styles.productDetails}>
                <View style={styles.tagRow}>
                  <Text style={styles.categoryTag}>{t('routine_cat_toner')}</Text>
                  <View style={styles.matchPill}>
                    <Text style={styles.matchPillText}>92% {t('routine_match_suffix')}</Text>
                  </View>
                </View>
                <Text style={styles.productName}>AHA/BHA Clarifying Treatment</Text>
                <Text style={styles.brandName}>COSRX</Text>
              </View>

              <GripVertical size={18} color="#CBD5E1" />
            </View>
          </View>

          {/* Adım 3: Serum (Conflict Durumu) */}
          <View style={styles.timelineStepRow}>
            <TouchableOpacity
              onPress={() => toggleStep(3)}
              style={[
                styles.stepCircleBadge,
                styles.conflictStepBadge,
                completedSteps.includes(3) && styles.stepCircleBadgeCompleted
              ]}
              activeOpacity={0.8}
            >
              {completedSteps.includes(3) ? (
                <Check size={14} color="#FFFFFF" />
              ) : (
                <Text style={styles.stepCircleNumberConflict}>3</Text>
              )}
            </TouchableOpacity>

            <View style={[styles.productCard, styles.conflictProductCard]}>
              <View style={[styles.productThumbnail, { backgroundColor: '#FEE2E2' }]}>
                <Sparkles size={20} color="#DC2626" />
              </View>

              <View style={styles.productDetails}>
                <View style={styles.tagRow}>
                  <Text style={styles.categoryTag}>{t('routine_cat_serum')}</Text>
                  <View style={styles.conflictPill}>
                    <Text style={styles.conflictPillText}>{t('routine_conflict_tag')}</Text>
                  </View>
                </View>
                <Text style={styles.productName}>Vitamin C Suspension 23%</Text>
                <Text style={styles.brandName}>The Ordinary</Text>
              </View>

              <GripVertical size={18} color="#CBD5E1" />
            </View>
          </View>

          {/* Adım 4: Moisturizer */}
          <View style={styles.timelineStepRow}>
            <TouchableOpacity
              onPress={() => toggleStep(4)}
              style={[
                styles.stepCircleBadge,
                completedSteps.includes(4) && styles.stepCircleBadgeCompleted
              ]}
              activeOpacity={0.8}
            >
              {completedSteps.includes(4) ? (
                <Check size={14} color="#FFFFFF" />
              ) : (
                <Text style={styles.stepCircleNumber}>4</Text>
              )}
            </TouchableOpacity>

            <View style={styles.productCard}>
              <View style={styles.productThumbnail}>
                <Layers size={20} color="#4F46E5" />
              </View>

              <View style={styles.productDetails}>
                <View style={styles.tagRow}>
                  <Text style={styles.categoryTag}>{t('routine_cat_moisturizer')}</Text>
                  <View style={styles.matchPill}>
                    <Text style={styles.matchPillText}>99% {t('routine_match_suffix')}</Text>
                  </View>
                </View>
                <Text style={styles.productName}>Natural Moisturizing Factors</Text>
                <Text style={styles.brandName}>The Ordinary</Text>
              </View>

              <GripVertical size={18} color="#CBD5E1" />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topSafeArea: {
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 110, // Floating Dock için alan
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  progressCircleContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    borderWidth: 2.5,
    borderColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4F46E5',
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  segmentButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  conflictCard: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    alignItems: 'flex-start',
    gap: 12,
  },
  conflictIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  conflictTextWrapper: {
    flex: 1,
  },
  conflictTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#DC2626',
    marginBottom: 2,
  },
  conflictBody: {
    fontSize: 12.5,
    color: '#7F1D1D',
    lineHeight: 18,
  },
  timelineContainer: {
    position: 'relative',
    paddingLeft: 4,
  },
  timelineVerticalLine: {
    position: 'absolute',
    left: 16,
    top: 24,
    bottom: 24,
    width: 2,
    backgroundColor: '#E0E7FF',
  },
  timelineStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 14,
  },
  stepCircleBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EEF2FF',
    borderWidth: 2,
    borderColor: '#C7D2FE',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  stepCircleBadgeCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  conflictStepBadge: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  stepCircleNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
  },
  stepCircleNumberConflict: {
    fontSize: 12,
    fontWeight: '800',
    color: '#DC2626',
  },
  productCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  conflictProductCard: {
    borderColor: '#FECACA',
    borderWidth: 1.5,
  },
  productThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  categoryTag: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.5,
  },
  matchPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 10,
  },
  matchPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4F46E5',
  },
  conflictPill: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 10,
  },
  conflictPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
  },
  productName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  brandName: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
});
