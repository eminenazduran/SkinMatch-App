import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

export type BadgeVariant = 'hero' | 'safe' | 'warning' | 'danger' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  icon,
  style,
  textStyle,
}) => {
  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'hero':
      case 'safe':
        return styles.safeContainer;
      case 'warning':
        return styles.warningContainer;
      case 'danger':
        return styles.dangerContainer;
      case 'info':
        return styles.infoContainer;
      case 'neutral':
      default:
        return styles.neutralContainer;
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'hero':
      case 'safe':
        return styles.safeText;
      case 'warning':
        return styles.warningText;
      case 'danger':
        return styles.dangerText;
      case 'info':
        return styles.infoText;
      case 'neutral':
      default:
        return styles.neutralText;
    }
  };

  return (
    <View
      style={[
        styles.baseContainer,
        size === 'sm' ? styles.sizeSm : styles.sizeMd,
        getContainerStyle(),
        style,
      ]}
    >
      {icon && <>{icon}</>}
      <Text
        style={[
          styles.baseText,
          size === 'sm' ? styles.textSm : styles.textMd,
          getTextStyle(),
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  baseText: {
    ...typography.badge,
  },
  // Sizes
  sizeSm: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  sizeMd: {
    paddingVertical: 4,
    paddingHorizontal: spacing.md - 4,
  },
  textSm: {
    fontSize: 11,
  },
  textMd: {
    fontSize: 12,
  },
  // Variants
  safeContainer: {
    backgroundColor: colors.successBg,
  },
  safeText: {
    color: colors.primaryDark,
  },
  warningContainer: {
    backgroundColor: colors.warningBg,
  },
  warningText: {
    color: colors.warning,
  },
  dangerContainer: {
    backgroundColor: colors.dangerBg,
  },
  dangerText: {
    color: colors.danger,
  },
  infoContainer: {
    backgroundColor: colors.infoBg,
  },
  infoText: {
    color: colors.info,
  },
  neutralContainer: {
    backgroundColor: colors.borderLight,
  },
  neutralText: {
    color: colors.textSecondary,
  },
});
