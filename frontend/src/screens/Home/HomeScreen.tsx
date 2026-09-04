import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Scan,
  FlaskConical,
  Droplet,
  Sparkles,
  Sun,
  Lightbulb,
  ChevronRight,
  ShieldCheck,
  Check,
  Bell,
  User
} from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/types';
import { useLanguage } from '../../context/LanguageContext';
import { useSkinProfile } from '../../context/SkinProfileContext';
import { colors } from '../../theme/colors';
import { shadows } from '../../theme/shadows';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t, language, toggleLanguage } = useLanguage();
  const { profile, isAnalyzed } = useSkinProfile();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const skinTypeDisplay = (() => {
    if (!isAnalyzed || profile.skinType === 'Not Determined') {
      return language === 'tr' ? 'Belirlenmedi' : 'Not Determined';
    }
    switch (profile.skinType) {
      case 'Oily':
        return t('skin_type_oily');
      case 'Dry':
        return t('skin_type_dry');
      case 'Combination':
        return t('skin_type_combination');
      case 'Normal':
        return t('skin_type_normal');
      case 'Sensitive':
        return t('skin_type_sensitive');
      default:
        return profile.skinType;
    }
  })();

  const barrierStatusText = (() => {
    if (!isAnalyzed) {
      return language === 'tr' ? 'Analiz Bekleniyor' : 'Analysis Pending';
    }
    if (profile.barrierHealth === 'Healthy') return t('home_balanced');
    if (profile.barrierHealth === 'Needs Repair') return language === 'tr' ? 'Onarımda' : 'Repairing';
    return language === 'tr' ? 'Dengeleniyor' : 'Balancing';
  })();

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  return (
    <View style={styles.container}>
      {/* 1. Lüks Gradyan Hero Üst Bölüm */}
      <LinearGradient
        colors={['#0F172A', '#1E1B4B', '#312E81']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroGradient}
      >
        <SafeAreaView edges={['top']} style={styles.heroSafeArea}>
          {/* Header Bar */}
          <View style={styles.topHeader}>
            <View style={styles.avatarGlass}>
              <User size={18} color="#FFFFFF" />
            </View>

            <View style={styles.logoRow}>
              <Text style={styles.logoText}>SkinMatch</Text>
              <View style={styles.proPill}>
                <Text style={styles.proText}>AI</Text>
              </View>
            </View>

            <View style={styles.headerRightActions}>
              <TouchableOpacity
                style={styles.langPillGlass}
                activeOpacity={0.75}
                onPress={toggleLanguage}
              >
                <Text style={styles.langText}>{language === 'tr' ? 'TR' : 'EN'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconButtonGlass} activeOpacity={0.7}>
                <Bell size={18} color="#FFFFFF" />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Karşılama Metni */}
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingTitle}>
              {language === 'tr' ? 'Hoş Geldiniz' : 'Welcome'}
            </Text>
            <Text style={styles.greetingSubtitle}>
              {isAnalyzed
                ? (language === 'tr'
                    ? 'Cildin bugün dengeli ve nem bariyeri güçlü görünüyor.'
                    : 'Your skin barrier appears healthy and balanced today.')
                : (language === 'tr'
                    ? 'Kişiselleştirilmiş analizini başlatmak için tarama yapın veya anketi tamamlayın.'
                    : 'Scan or take the quiz to generate your real skin profile.')}
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* 2. Kaydırılabilir İçerik Alanı */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Yüzen Metrik Paneli (Floating Quick Deck) */}
        <View style={styles.floatingDeckCard}>
          {/* Sol Kolon: Cilt Durumu */}
          <View style={styles.metricColumn}>
            <View style={styles.metricHeaderRow}>
              <View
                style={[
                  styles.pulseIndicator,
                  {
                    backgroundColor: !isAnalyzed
                      ? '#94A3B8'
                      : profile.barrierHealth === 'Needs Repair'
                      ? '#EF4444'
                      : profile.barrierHealth === 'Compromised'
                      ? '#F59E0B'
                      : '#10B981',
                  },
                ]}
              />
              <Text style={styles.metricTag}>{t('home_status')}</Text>
              <Text style={styles.metricStatusText}>• {barrierStatusText}</Text>
            </View>
            <Text style={styles.metricMainValue}>{skinTypeDisplay}</Text>
            <View style={styles.barrierProgressRow}>
              <ShieldCheck size={14} color="#4F46E5" />
              <Text style={styles.barrierScoreText}>
                {t('home_barrier_label')}{' '}
                <Text style={styles.barrierBoldText}>
                  {isAnalyzed && profile.barrierScore > 0 ? `%${profile.barrierScore}` : '—'}
                </Text>
              </Text>
            </View>
          </View>

          {/* Dikey Zarif Çizgi */}
          <View style={styles.metricDivider} />

          {/* Sağ Kolon: UV & Çevre */}
          <View style={styles.metricColumn}>
            <View style={styles.metricHeaderRow}>
              <View style={[styles.pulseIndicator, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.metricTag}>{t('home_environment')}</Text>
              <Text style={[styles.metricStatusText, { color: '#EF4444' }]}>• {t('home_high')}</Text>
            </View>
            <Text style={styles.metricMainValue}>{t('home_uv_val')}</Text>
            <Text style={styles.uvAdviceSubtitle}>{t('home_uv_sub')}</Text>
          </View>
        </View>

        {/* 3. Yapay Zeka Canlı Tarama Banner'ı (Göz Alıcı İndigo Gradyan) */}
        <LinearGradient
          colors={['#4F46E5', '#6366F1', '#4338CA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.8 }}
          style={styles.aiScanBanner}
        >
          <View style={styles.aiScanLeft}>
            <View style={styles.aiBadgeRow}>
              <Sparkles size={14} color="#FDE047" />
              <Text style={styles.aiBadgeText}>DERMA-VISION AI</Text>
            </View>
            <Text style={styles.aiScanTitle}>{t('home_daily_analysis_title')}</Text>
            <Text style={styles.aiScanDescription}>
              {t('home_daily_analysis_desc')}
            </Text>

            <TouchableOpacity
              style={styles.scanActionButton}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('SelfieAnalysis')}
            >
              <Scan size={16} color="#4F46E5" />
              <Text style={styles.scanActionText}>{t('home_scan_btn')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.aiScanRightGraphic}>
            <View style={styles.glowAura} />
            <View style={styles.flaskGlass}>
              <FlaskConical size={34} color="#FFFFFF" />
            </View>
          </View>
        </LinearGradient>

        {/* 4. Sabah Rutini Akışı (Etkileşimli & Yatay Kartlar) */}
        <View style={styles.sectionTitleRow}>
          <View>
            <Text style={styles.sectionHeading}>{t('home_morning_routine')}</Text>
            <Text style={styles.sectionSubheading}>Günün 3 temel koruyucu adımı</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('MainTabs', { screen: 'RoutineTab' })}
            style={styles.seeAllAction}
            activeOpacity={0.7}
          >
            <Text style={styles.seeAllText}>{t('home_see_all')}</Text>
            <ChevronRight size={15} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollTrack}
        >
          {/* Adım 1 */}
          <TouchableOpacity
            style={[
              styles.routineStepTile,
              completedSteps.includes(1) && styles.routineStepTileCompleted
            ]}
            activeOpacity={0.8}
            onPress={() => toggleStep(1)}
          >
            <View style={styles.tileTopRow}>
              <View style={[styles.stepIconBox, { backgroundColor: '#EEF2FF' }]}>
                <Droplet size={18} color="#4F46E5" />
              </View>
              <View
                style={[
                  styles.checkCircle,
                  completedSteps.includes(1) && styles.checkCircleActive
                ]}
              >
                {completedSteps.includes(1) && <Check size={12} color="#FFFFFF" />}
              </View>
            </View>
            <Text style={styles.tileStepTag}>{t('home_step1_tag')}</Text>
            <Text style={styles.tileStepName}>{t('home_step1_name')}</Text>
          </TouchableOpacity>

          {/* Adım 2 */}
          <TouchableOpacity
            style={[
              styles.routineStepTile,
              completedSteps.includes(2) && styles.routineStepTileCompleted
            ]}
            activeOpacity={0.8}
            onPress={() => toggleStep(2)}
          >
            <View style={styles.tileTopRow}>
              <View style={[styles.stepIconBox, { backgroundColor: '#F5F3FF' }]}>
                <Sparkles size={18} color="#7C3AED" />
              </View>
              <View
                style={[
                  styles.checkCircle,
                  completedSteps.includes(2) && styles.checkCircleActive
                ]}
              >
                {completedSteps.includes(2) && <Check size={12} color="#FFFFFF" />}
              </View>
            </View>
            <Text style={styles.tileStepTag}>{t('home_step2_tag')}</Text>
            <Text style={styles.tileStepName}>{t('home_step2_name')}</Text>
          </TouchableOpacity>

          {/* Adım 3 */}
          <TouchableOpacity
            style={[
              styles.routineStepTile,
              completedSteps.includes(3) && styles.routineStepTileCompleted
            ]}
            activeOpacity={0.8}
            onPress={() => toggleStep(3)}
          >
            <View style={styles.tileTopRow}>
              <View style={[styles.stepIconBox, { backgroundColor: '#FFFBEB' }]}>
                <Sun size={18} color="#D97706" />
              </View>
              <View
                style={[
                  styles.checkCircle,
                  completedSteps.includes(3) && styles.checkCircleActive
                ]}
              >
                {completedSteps.includes(3) && <Check size={12} color="#FFFFFF" />}
              </View>
            </View>
            <Text style={styles.tileStepTag}>{t('home_step3_tag')}</Text>
            <Text style={styles.tileStepName}>{t('home_step3_name')}</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* 5. Günlük Dermatolojik İpucu (Editorial Quote Tasarımı) */}
        <View style={styles.editorialTipCard}>
          <View style={styles.tipAccentBar} />
          <View style={styles.tipContentWrapper}>
            <View style={styles.tipLabelRow}>
              <Lightbulb size={16} color="#4F46E5" />
              <Text style={styles.tipLabelText}>{t('home_tip_title').toUpperCase()}</Text>
            </View>
            <Text style={styles.tipBodyText}>{t('home_tip_desc')}</Text>
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
  heroGradient: {
    paddingBottom: 36,
  },
  heroSafeArea: {
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatarGlass: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  proPill: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  proText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  langPillGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  langText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  iconButtonGlass: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
  },
  greetingContainer: {
    marginBottom: 4,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 13.5,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
    marginTop: -24,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110, // Floating Dock için boşluk
  },
  floatingDeckCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 8,
    marginBottom: 20,
  },
  metricColumn: {
    flex: 1,
  },
  metricHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  pulseIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  metricTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  metricStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  metricMainValue: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  barrierProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  barrierScoreText: {
    fontSize: 12,
    color: '#64748B',
  },
  barrierBoldText: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  uvAdviceSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  metricDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 14,
  },
  aiScanBanner: {
    borderRadius: 24,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  aiScanLeft: {
    flex: 1,
    paddingRight: 10,
    zIndex: 2,
  },
  aiBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  aiBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FDE047',
    letterSpacing: 0.8,
  },
  aiScanTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  aiScanDescription: {
    fontSize: 12.5,
    color: 'rgba(255, 255, 255, 0.82)',
    lineHeight: 18,
    marginBottom: 16,
  },
  scanActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignSelf: 'flex-start',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  scanActionText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4F46E5',
  },
  aiScanRightGraphic: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glowAura: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  flaskGlass: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  sectionSubheading: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  seeAllAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },
  horizontalScrollTrack: {
    paddingRight: 10,
    gap: 12,
    marginBottom: 26,
  },
  routineStepTile: {
    width: width * 0.42,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  routineStepTileCompleted: {
    borderColor: '#C7D2FE',
    backgroundColor: '#F8FAFF',
  },
  tileTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepIconBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  tileStepTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  tileStepName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18,
  },
  editorialTipCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  tipAccentBar: {
    width: 5,
    backgroundColor: '#4F46E5',
  },
  tipContentWrapper: {
    flex: 1,
    padding: 16,
  },
  tipLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  tipLabelText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.8,
  },
  tipBodyText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
});
