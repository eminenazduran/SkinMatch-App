import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ViewStyle,
  Text,
  TouchableOpacity
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface ScreenWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  onBackPress?: () => void;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  statusBarStyle?: 'light-content' | 'dark-content';
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  title,
  subtitle,
  headerRight,
  onBackPress,
  scrollable = true,
  style,
  contentContainerStyle,
  statusBarStyle = 'dark-content',
}) => {
  const renderHeader = () => {
    if (!title && !onBackPress && !headerRight) return null;

    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          {onBackPress && (
            <TouchableOpacity
              onPress={onBackPress}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>‹ Geri</Text>
            </TouchableOpacity>
          )}
          {title && <Text style={styles.headerTitle}>{title}</Text>}
          {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
        </View>
        {headerRight && <View style={styles.headerRight}>{headerRight}</View>}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={colors.background} />
      {renderHeader()}
      {scrollable ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.nonScrollContent, contentContainerStyle]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    marginLeft: spacing.md,
  },
  backButton: {
    marginBottom: spacing.xs,
    paddingVertical: 2,
  },
  backButtonText: {
    ...typography.bodyBold,
    color: colors.primary,
    fontSize: 16,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  nonScrollContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
});
