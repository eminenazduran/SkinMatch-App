import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Droplet,
  Sparkles,
  Waves,
  ShieldAlert
} from 'lucide-react-native';
import { useLanguage } from '../../context/LanguageContext';
import { colors } from '../../theme/colors';
import { shadows } from '../../theme/shadows';

interface QuizOption {
  id: string;
  renderIcon: (color: string) => React.ReactNode;
  titleKey: string;
}

export const QuizScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const options: QuizOption[] = [
    {
      id: 'dry',
      renderIcon: (color) => <Droplet size={24} color={color} />,
      titleKey: 'quiz_opt_tight_dry',
    },
    {
      id: 'combo',
      renderIcon: (color) => <Sparkles size={24} color={color} />,
      titleKey: 'quiz_opt_tzone',
    },
    {
      id: 'oily',
      renderIcon: (color) => <Waves size={24} color={color} />,
      titleKey: 'quiz_opt_oily',
    },
    {
      id: 'sensitive',
      renderIcon: (color) => <ShieldAlert size={24} color={color} />,
      titleKey: 'quiz_opt_sensitive',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Üst Bar: GERİ Butonu ve SkinMatch Logosu */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={colors.primary} />
          <Text style={styles.backText}>{t('quiz_back')}</Text>
        </TouchableOpacity>

        <Text style={styles.headerLogo}>SkinMatch</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Seçenek Kartları Listesi */}
        <View style={styles.optionsList}>
          {options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const iconColor = isSelected ? colors.primary : colors.textSecondary;

            return (
              <TouchableOpacity
                key={option.id}
                activeOpacity={0.85}
                onPress={() => setSelectedOptionId(option.id)}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected
                ]}
              >
                <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
                  {option.renderIcon(iconColor)}
                </View>

                <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                  {t(option.titleKey)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Seçim yapıldığında ilerleme butonu */}
        {selectedOptionId && (
          <TouchableOpacity
            style={styles.continueButton}
            activeOpacity={0.85}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.continueButtonText}>{t('quiz_save_btn')}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: colors.background,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  backText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  headerLogo: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  headerSpacer: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  optionsList: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...shadows.sm,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F5F3FF',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircleSelected: {
    backgroundColor: '#EDE9FE',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  optionTitleSelected: {
    color: colors.primary,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
    ...shadows.sm,
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
