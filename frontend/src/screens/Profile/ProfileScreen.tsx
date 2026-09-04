import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Heart,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ClipboardList,
  Camera
} from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/types';
import { useLanguage } from '../../context/LanguageContext';
import { useSkinProfile } from '../../context/SkinProfileContext';
import { AppHeader } from '../../components/common/AppHeader';
import { colors } from '../../theme/colors';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t, language } = useLanguage();
  const { profile } = useSkinProfile();

  const skinTypeDisplay = (() => {
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

  const barrierBadgeText = language === 'tr' ? profile.barrierBadgeTr : profile.barrierBadgeEn;

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.topSafeArea}>
        <AppHeader />
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Profil Pasaportu Başlığı */}
        <View style={styles.profileHero}>
          <Text style={styles.greetingTitle}>{t('profile_greeting')}</Text>
          <Text style={styles.profileDescription}>
            {t('profile_desc_start')}
            <Text style={styles.highlightText}>{skinTypeDisplay}</Text>
            {t('profile_desc_end')}
          </Text>

          {/* İkili Eylem Butonları */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.retakeQuizBtn}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('Quiz')}
            >
              <ClipboardList size={15} color="#FFFFFF" />
              <Text style={styles.retakeQuizBtnText}>{t('profile_btn_retake')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.faceAnalysisBtn}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('SelfieAnalysis')}
            >
              <Camera size={15} color="#4F46E5" />
              <Text style={styles.faceAnalysisBtnText}>{t('profile_btn_face_scan')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Dairesel Bariyer Sağlığı Göstergesi (Bariyer Kartı) */}
        <View style={styles.barrierHealthCard}>
          <View style={styles.gaugeContainer}>
            <View style={styles.gaugeOuterRing}>
              <View style={styles.gaugeInnerContent}>
                <Text style={styles.gaugePercentNumber}>{profile.barrierScore}%</Text>
                <Text style={styles.gaugeLabel}>{t('profile_barrier_health')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.barrierBadgeRow}>
            <ShieldCheck size={16} color="#4F46E5" />
            <Text style={styles.barrierBadgeText}>{barrierBadgeText}</Text>
          </View>
        </View>

        {/* 3. Bileşen Tercihleri (Sevilenler & Kaçınılacaklar) */}
        <Text style={styles.sectionHeading}>{t('profile_ingredient_heading')}</Text>

        {/* Sevilenler (Love) */}
        <View style={styles.ingredientBlock}>
          <View style={styles.blockHeader}>
            <View style={[styles.blockIconCircle, { backgroundColor: '#F5F3FF' }]}>
              <Heart size={16} color="#7C3AED" />
            </View>
            <View style={styles.blockTitleWrapper}>
              <Text style={styles.blockTitle}>{t('profile_love_title')}</Text>
              <Text style={styles.blockSubtitle}>{t('profile_love_desc')}</Text>
            </View>
          </View>

          <View style={styles.chipsContainer}>
            {profile.loveIngredients.map((item, idx) => (
              <View key={idx} style={styles.loveChip}>
                <Text style={styles.loveChipText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Kaçınılacaklar (Avoid) */}
        {profile.avoidIngredients.length > 0 && (
          <View style={[styles.ingredientBlock, styles.avoidBlockBorder]}>
            <View style={styles.blockHeader}>
              <View style={[styles.blockIconCircle, { backgroundColor: '#FEF2F2' }]}>
                <AlertCircle size={16} color="#DC2626" />
              </View>
              <View style={styles.blockTitleWrapper}>
                <Text style={styles.blockTitle}>{t('profile_avoid_title')}</Text>
                <Text style={styles.blockSubtitle}>{t('profile_avoid_desc')}</Text>
              </View>
            </View>

            <View style={styles.chipsContainer}>
              {profile.avoidIngredients.map((item, idx) => (
                <View key={idx} style={styles.avoidChip}>
                  <Text style={styles.avoidChipText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
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
    paddingTop: 8,
    paddingBottom: 110, // Floating Dock için alan
  },
  profileHero: {
    marginBottom: 20,
  },
  greetingTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  profileDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 18,
  },
  highlightText: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  retakeQuizBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  retakeQuizBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  faceAnalysisBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  faceAnalysisBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },
  barrierHealthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 4,
  },
  gaugeContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  gaugeOuterRing: {
    width: 154,
    height: 154,
    borderRadius: 77,
    borderWidth: 14,
    borderColor: '#EEF2FF',
    borderTopColor: '#4F46E5',
    borderRightColor: '#4F46E5',
    borderBottomColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-45deg' }],
  },
  gaugeInnerContent: {
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
  },
  gaugePercentNumber: {
    fontSize: 30,
    fontWeight: '900',
    color: '#4F46E5',
  },
  gaugeLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  barrierBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  barrierBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  sectionHeading: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  ingredientBlock: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  avoidBlockBorder: {
    borderColor: '#FEE2E2',
  },
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  blockIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockTitleWrapper: {
    flex: 1,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  blockSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  loveChip: {
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  loveChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6D28D9',
  },
  avoidChip: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  avoidChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
});
