import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Heart,
  AlertTriangle,
  RotateCcw,
  CheckCircle2
} from 'lucide-react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useSkinProfile } from '../../context/SkinProfileContext';
import {
  quizQuestions,
  IAnswerSelection,
  IComputedSkinProfileResult,
  calculateSkinProfile
} from '../../data/quizQuestions';
import { QuizProgressBar } from '../../components/quiz/QuizProgressBar';
import { QuizOptionCard } from '../../components/quiz/QuizOptionCard';
import { colors } from '../../theme/colors';

export const QuizScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t, language } = useLanguage();
  const { saveQuizResults, isSubmitting } = useSkinProfile();

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [answersMap, setAnswersMap] = useState<Record<string, IAnswerSelection>>({});
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [resultProfile, setResultProfile] = useState<IComputedSkinProfileResult | null>(null);

  const currentQuestion = quizQuestions[currentStepIndex];
  const totalSteps = quizQuestions.length;
  const isLastQuestion = currentStepIndex === totalSteps - 1;
  const selectedAnswer = currentQuestion ? answersMap[currentQuestion.id] : null;

  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;

    const chosenOption = currentQuestion.options.find((opt) => opt.id === optionId);
    if (!chosenOption) return;

    const answerObj: IAnswerSelection = {
      questionId: currentQuestion.id,
      selectedOptionId: chosenOption.id,
      selectedOptionText: language === 'tr' ? chosenOption.textTr : chosenOption.textEn,
      weightEffect: {
        oiliness: chosenOption.weightEffect.oiliness || 0,
        dryness: chosenOption.weightEffect.dryness || 0,
        sensitivity: chosenOption.weightEffect.sensitivity || 0,
      },
      concernValue: chosenOption.concernValue,
    };

    const updatedAnswers = {
      ...answersMap,
      [currentQuestion.id]: answerObj,
    };
    setAnswersMap(updatedAnswers);

    // Yumuşak geçiş: Seçimden 280ms sonra otomatik bir sonraki soruya veya sonuca geç
    setTimeout(() => {
      if (!isLastQuestion) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        finishQuiz(updatedAnswers);
      }
    }, 280);
  };

  const handleGoBack = () => {
    if (resultProfile) {
      // Sonuç ekranındaysa son soruya dön
      setResultProfile(null);
      setCurrentStepIndex(totalSteps - 1);
      return;
    }

    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  const finishQuiz = (finalAnswersMap: Record<string, IAnswerSelection>) => {
    setIsCalculating(true);
    const answersArray = Object.values(finalAnswersMap);
    const computed = calculateSkinProfile(answersArray);

    setTimeout(() => {
      setResultProfile(computed);
      setIsCalculating(false);
    }, 600);
  };

  const handleSaveAndApply = async () => {
    if (!resultProfile) return;
    const answersArray = Object.values(answersMap);
    await saveQuizResults(answersArray);
    navigation.goBack();
  };

  const handleRestartQuiz = () => {
    setAnswersMap({});
    setCurrentStepIndex(0);
    setResultProfile(null);
  };

  const getSkinTypeLocalized = (type: string) => {
    switch (type) {
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
        return type;
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* 1. Üst Bar: Geri Butonu ve Başlık */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#4F46E5" />
          <Text style={styles.backText}>{t('quiz_back')}</Text>
        </TouchableOpacity>

        <Text style={styles.topTitle}>{t('quiz_header_title')}</Text>

        <View style={styles.topSpacer} />
      </View>

      {/* 2. Hesaplama Yükleniyor Durumu */}
      {isCalculating ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>{t('quiz_calculating')}</Text>
        </View>
      ) : resultProfile ? (
        /* 3. Anket Sonuç Ekranı */
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.resultScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.resultBadgeRow}>
            <Sparkles size={18} color="#4F46E5" />
            <Text style={styles.resultBadgeTag}>BAUMANN LOGIC-TREE RESULT</Text>
          </View>

          <Text style={styles.resultHeroTitle}>{t('quiz_result_title')}</Text>
          <Text style={styles.resultHeroSubtitle}>{t('quiz_result_subtitle')}</Text>

          {/* Cilt Tipi ve Bariyer Kartı */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryCol}>
                <Text style={styles.summaryLabel}>{t('quiz_result_type_label')}</Text>
                <Text style={styles.summaryValueText}>
                  {getSkinTypeLocalized(resultProfile.skinType)}
                </Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryCol}>
                <Text style={styles.summaryLabel}>{t('quiz_result_score_label')}</Text>
                <Text style={[styles.summaryValueText, { color: '#4F46E5' }]}>
                  %{resultProfile.barrierScore}
                </Text>
              </View>
            </View>

            <View style={styles.barrierStatusRow}>
              <ShieldCheck size={16} color="#4F46E5" />
              <Text style={styles.barrierStatusText}>
                {language === 'tr' ? resultProfile.barrierBadgeTr : resultProfile.barrierBadgeEn}
              </Text>
            </View>
          </View>

          {/* Sevilen Bileşenler */}
          <View style={styles.ingredientsBox}>
            <View style={styles.boxHeaderRow}>
              <Heart size={16} color="#7C3AED" />
              <Text style={styles.boxHeaderText}>{t('profile_love_title')}</Text>
            </View>
            <View style={styles.chipsWrap}>
              {resultProfile.loveIngredients.map((item, idx) => (
                <View key={idx} style={styles.loveChip}>
                  <Text style={styles.loveChipText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Kaçınılması Gereken Bileşenler */}
          {resultProfile.avoidIngredients.length > 0 && (
            <View style={[styles.ingredientsBox, styles.avoidBoxBorder]}>
              <View style={styles.boxHeaderRow}>
                <AlertTriangle size={16} color="#DC2626" />
                <Text style={[styles.boxHeaderText, { color: '#991B1B' }]}>
                  {t('profile_avoid_title')}
                </Text>
              </View>
              <View style={styles.chipsWrap}>
                {resultProfile.avoidIngredients.map((item, idx) => (
                  <View key={idx} style={styles.avoidChip}>
                    <Text style={styles.avoidChipText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Eylem Butonları */}
          <View style={styles.actionButtonsCol}>
            <TouchableOpacity
              style={styles.applyButton}
              activeOpacity={0.88}
              onPress={handleSaveAndApply}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <CheckCircle2 size={18} color="#FFFFFF" />
                  <Text style={styles.applyButtonText}>{t('quiz_apply_profile_btn')}</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.restartButton}
              activeOpacity={0.8}
              onPress={handleRestartQuiz}
            >
              <RotateCcw size={16} color="#4F46E5" />
              <Text style={styles.restartButtonText}>{t('quiz_retake_btn')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        /* 4. Soru ve Seçenekler Akışı */
        <View style={styles.quizFlowContainer}>
          {/* İlerleme Çubuğu */}
          <QuizProgressBar
            currentStep={currentStepIndex + 1}
            totalSteps={totalSteps}
            stepLabel={`${t('quiz_step_counter')} ${currentStepIndex + 1} / ${totalSteps}`}
          />

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.questionScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Soru Başlığı ve Alt Bilgisi */}
            <View style={styles.questionHero}>
              <Text style={styles.questionTitle}>
                {language === 'tr' ? currentQuestion.titleTr : currentQuestion.titleEn}
              </Text>
              <Text style={styles.questionSubtitle}>
                {language === 'tr' ? currentQuestion.subtitleTr : currentQuestion.subtitleEn}
              </Text>
            </View>

            {/* Seçenek Kartları Listesi */}
            <View style={styles.optionsList}>
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedAnswer?.selectedOptionId === opt.id;
                return (
                  <QuizOptionCard
                    key={opt.id}
                    id={opt.id}
                    title={language === 'tr' ? opt.textTr : opt.textEn}
                    description={language === 'tr' ? opt.descTr : opt.descEn}
                    iconName={opt.iconName}
                    isSelected={isSelected}
                    onPress={() => handleSelectOption(opt.id)}
                  />
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}
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
  quizFlowContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  questionScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  questionHero: {
    marginBottom: 20,
  },
  questionTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 29,
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  questionSubtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
  },
  optionsList: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 30,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4F46E5',
    textAlign: 'center',
  },
  resultScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 60,
  },
  resultBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  resultBadgeTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 1,
  },
  resultHeroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  resultHeroSubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#EEF2FF',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  summaryLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryValueText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  barrierStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 14,
  },
  barrierStatusText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#4F46E5',
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
  actionButtonsCol: {
    marginTop: 10,
    gap: 12,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EEF2FF',
    paddingVertical: 14,
    borderRadius: 16,
  },
  restartButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F46E5',
  },
});
