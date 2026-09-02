import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ViewStyle,
  TouchableOpacityProps
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'subtle';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  style,
  onPress,
  ...rest
}) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'default':
        return styles.defaultCard;
      case 'elevated':
        return styles.elevatedCard;
      case 'outlined':
        return styles.outlinedCard;
      case 'subtle':
        return styles.subtleCard;
      default:
        return styles.defaultCard;
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[styles.baseCard, getVariantStyle(), style]}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.baseCard, getVariantStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  baseCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  defaultCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  elevatedCard: {
    backgroundColor: colors.surface,
    ...shadows.md,
  },
  outlinedCard: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  subtleCard: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
});
