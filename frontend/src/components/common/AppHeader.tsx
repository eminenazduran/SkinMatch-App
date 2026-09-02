import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Bell, ArrowLeft, User } from 'lucide-react-native';
import { useLanguage } from '../../context/LanguageContext';
import { colors } from '../../theme/colors';

interface AppHeaderProps {
  showBack?: boolean;
  onBack?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ showBack = false, onBack }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <View style={styles.topHeader}>
      {showBack && onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.headerIconButton} activeOpacity={0.7}>
          <ArrowLeft size={22} color={colors.primary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.avatarCircle}>
          <User size={18} color={colors.primary} />
        </View>
      )}

      <Text style={styles.headerLogo}>SkinMatch</Text>

      <View style={styles.headerRightActions}>
        {/* Dil Değiştirici Buton (TR / EN) */}
        <TouchableOpacity
          style={styles.langTogglePill}
          activeOpacity={0.75}
          onPress={toggleLanguage}
        >
          <Text style={styles.langText}>
            {language === 'tr' ? 'TR' : 'EN'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.7}>
          <Bell size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: colors.background,
  },
  headerIconButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  headerLogo: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langTogglePill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  langText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
});
