import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Sparkles,
  Heart,
  AlertTriangle,
  CheckCircle2,
  Waves,
  Flame,
  Target
} from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/types';
import { useLanguage } from '../../context/LanguageContext';
import { useSkinProfile, IHybridSkinAnalysis, ISelfieMetrics } from '../../context/SkinProfileContext';
import { BarrierHealthGauge } from '../../components/profile/BarrierHealthGauge';
import { colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

type SkinProfileResultRouteProp = RouteProp<RootStackParamList, 'SkinProfileResult'>;

export const SkinProfileResultScreen: React.FC = () => {
  const route = useRoute<SkinProfileResultRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t, language } = useLanguage();
  const { profile } = useSkinProfile();

  const result: IHybridSkinAnalysis = route.params?.result || {
    determinedSkinType: profile.skinType || 'Combination',
    barrierHealth: profile.barrierHealth || 'Healthy',
    oilinessLevel: 'Dengeli Sebum',
    analysisSummary: 'Yüz analizi ve anket sonuçlarınız başarıyla senkronize edildi.',
    keyRecommendations: ['Günlük nemlendiricinizi aksatmayın', 'SPF 50 güneş koruyucu kullanın'],
    ingredientsToLookFor: ['Niacinamide', 'Hyaluronic Acid', 'Ceramides'],
    ingredientsToAvoid: ['Alcohol Denat', 'Synthetic Fragrance'],
  };

  const photoUri = route.params?.photoUri;
  const metrics: ISelfieMetrics = route.params?.metrics || {
    oilinessScore: 60,
    rednessScore: 25,
    poreScore: 45,
  };

  const handleApplyAndFinish = () => {
    navigation.navigate('MainTabs', { screen: 'ProfileTab' } as any);
  };

  const skinTypeDisplay = (() => {
    switch (result.determinedSkinType) {
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
        return result.determinedSkinType;
    }
  })();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* 1. Üst Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#4F46E5" />
          <Text style={styles.backText}>{t('quiz_back')}</Text>
        </TouchableOpacity>

        <Text style={styles.topTitle}>
          {language === 'tr' ? 'Hibrit Cilt Profili' : 'Hybrid Skin Profile'}
        </Text>

        <View style={styles.topSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Hero Başlık ve Rozet */}
        <View style={styles.heroCard}>
          <View style={styles.badgeRow}>
            <Sparkles size={16} color="#4F46E5" />
            <Text style={styles.badgeText}>AI VISION + LOGIC-TREE HYBRID</Text>
          </View>

          <View style={styles.heroMainRow}>
            <View style={styles.heroTextCol}>
              <Text style={styles.heroLabel}>
                {language === 'tr' ? 'Nihai Cilt Tipiniz' : 'Your Determined Skin Type'}
              </Text>
              <Text style={styles.heroSkinType}>{skinTypeDisplay}</Text>
              <Text style={styles.heroSubtitle}>
                {language === 'tr'
                  ? 'Kamera sebum haritası ve anket yanıtları ile doğrulandı.'
                  : 'Verified with camera sebum map & questionnaire.'}
              </Text>
            </View>

            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.selfieThumbnail} />
            ) : null}
          </View>
        </View>

        {/* 3. Dairesel Bariyer Göstergesi */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {language === 'tr' ? 'Cilt Bariyeri Sağlığı' : 'Skin Barrier Health'}
          </Text>
          <BarrierHealthGauge score={profile.barrierScore} />
        </View>

        {/* 4. Yüz Görsel Metrikleri Kartı */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {language === 'tr' ? 'Yüz Taraması Metrikleri' : 'Facial Scan Metrics'}
          </Text>

          <View style={styles.metricsRow}>
            {/* Yağlanma */}
            <View style={styles.metricBox}>
              <View style={[styles.metricIconCircle, { backgroundColor: '#EEF2FF' }]}>
                <Waves size={18} color="#4F46E5" />
              </View>
              <Text style={styles.metricVal}>%{metrics.oilinessScore}</Text>
              <Text style={styles.metricSub}>
                {language === 'tr' ? 'T-Bölgesi Yağ' : 'T-Zone Oil'}
              </Text>
            </View>

            <View style={styles.metricDivider} />

            {/* Kızarıklık */}
            <View style={styles.metricBox}>
              <View style={[styles.metricIconCircle, { backgroundColor: '#FEF2F2' }]}>
                <Flame size={18} color="#EF4444" />
              </View>
              <Text style={[styles.metricVal, { color: '#EF4444' }]}>%{metrics.rednessScore}</Text>
              <Text style={styles.metricSub}>
                {language === 'tr' ? 'Hassasiyet' : 'Sensitivity'}
              </Text>
            </View>

            <View style={styles.metricDivider} />

            {/* Gözenek */}
            <View style={styles.metricBox}>
              <View style={[styles.metricIconCircle, { backgroundColor: '#F0FDF4' }]}>
                <Target size={18} color="#16A34A" />
              </View>
              <Text style={[styles.metricVal, { color: '#16A34A' }]}>%{metrics.poreScore}</Text>
              <Text style={styles.metricSub}>
                {language === 'tr' ? 'Gözenekler' : 'Pores'}
              </Text>
            </View>
          </View>
        </View>

        {/* 5. Yapay Zeka Özeti ve Klinik Öneriler */}
        {result.analysisSummary && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Sparkles size={16} color="#4F46E5" />
              <Text style={styles.summaryTitle}>
                {language === 'tr' ? 'Dermatolojik Değerlendirme' : 'Dermatological Insights'}
              </Text>
            </View>
            <Text style={styles.summaryText}>{result.analysisSummary}</Text>

            {result.keyRecommendations && result.keyRecommendations.length > 0 && (
              <View style={styles.recsList}>
                {result.keyRecommendations.map((rec, i) => (
                  <View key={i} style={styles.recItemRow}>
                    <CheckCircle2 size={15} color="#4F46E5" />
                    <Text style={styles.recItemText}>{rec}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* 6. Tercih Edilecek Kahraman Bileşenler */}
        {result.ingredientsToLookFor && result.ingredientsToLookFor.length > 0 && (
          <View style={styles.ingredientsBox}>
            <View style={styles.boxHeaderRow}>
              <Heart size={16} color="#7C3AED" />
              <Text style={styles.boxHeaderText}>{t('profile_love_title')}</Text>
            </View>
            <View style={styles.chipsWrap}>
              {result.ingredientsToLookFor.map((item, idx) => (
                <View key={idx} style={styles.loveChip}>
                  <Text style={styles.loveChipText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 7. Kaçınılması Gereken Bileşenler */}
        {result.ingredientsToAvoid && result.ingredientsToAvoid.length > 0 && (
          <View style={[styles.ingredientsBox, styles.avoidBoxBorder]}>
            <View style={styles.boxHeaderRow}>
              <AlertTriangle size={16} color="#DC2626" />
              <Text style={[styles.boxHeaderText, { color: '#991B1B' }]}>
                {t('profile_avoid_title')}
              </Text>
            </View>
            <View style={styles.chipsWrap}>
              {result.ingredientsToAvoid.map((item, idx) => (
                <View key={idx} style={styles.avoidChip}>
                  <Text style={styles.avoidChipText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 8. Kaydet ve Bitir Butonu */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleApplyAndFinish}
          activeOpacity={0.88}
        >
          <CheckCircle2 size={18} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>
            {language === 'tr' ? 'Profili Kaydet ve Tamamla' : 'Save & Finish Profile'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    minWidth: 70,
  },
  backText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.5,
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  topSpacer: {
    minWidth: 70,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 48,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#EEF2FF',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.8,
  },
  heroMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTextCol: {
    flex: 1,
    marginRight: 14,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
  },
  heroSkinType: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
  },
  selfieThumbnail: {
    width: 74,
    height: 96,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  metricBox: {
    alignItems: 'center',
    flex: 1,
  },
  metricIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 2,
  },
  metricSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  metricDivider: {
    width: 1,
    height: 44,
    backgroundColor: '#E2E8F0',
  },
  summaryCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#312E81',
  },
  summaryText: {
    fontSize: 13,
    color: '#4338CA',
    lineHeight: 20,
    marginBottom: 12,
  },
  recsList: {
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E7FF',
    paddingTop: 10,
  },
  recItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  recItemText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#3730A3',
    flex: 1,
    lineHeight: 18,
  },
  ingredientsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  avoidBoxBorder: {
    borderColor: '#FEE2E2',
  },
  boxHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  boxHeaderText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  chipsWrap: {
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
    borderColor: '#DDD6FE',
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
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
