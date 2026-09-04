import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {
  Droplet,
  Sparkles,
  Waves,
  ShieldAlert,
  Sun,
  Flame,
  CheckCircle2,
  Target,
  Check
} from 'lucide-react-native';
import { colors } from '../../theme/colors';

interface QuizOptionCardProps {
  id: string;
  title: string;
  description?: string;
  iconName: 'Droplet' | 'Sparkles' | 'Waves' | 'ShieldAlert' | 'Sun' | 'Flame' | 'CheckCircle2' | 'Target';
  isSelected: boolean;
  onPress: () => void;
}

export const QuizOptionCard: React.FC<QuizOptionCardProps> = ({
  title,
  description,
  iconName,
  isSelected,
  onPress,
}) => {
  const iconColor = isSelected ? '#4F46E5' : '#64748B';

  const renderIcon = () => {
    const size = 22;
    switch (iconName) {
      case 'Droplet':
        return <Droplet size={size} color={iconColor} />;
      case 'Sparkles':
        return <Sparkles size={size} color={iconColor} />;
      case 'Waves':
        return <Waves size={size} color={iconColor} />;
      case 'ShieldAlert':
        return <ShieldAlert size={size} color={iconColor} />;
      case 'Sun':
        return <Sun size={size} color={iconColor} />;
      case 'Flame':
        return <Flame size={size} color={iconColor} />;
      case 'CheckCircle2':
        return <CheckCircle2 size={size} color={iconColor} />;
      case 'Target':
        return <Target size={size} color={iconColor} />;
      default:
        return <Sparkles size={size} color={iconColor} />;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.card, isSelected && styles.cardSelected]}
    >
      <View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
        {renderIcon()}
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.title, isSelected && styles.titleSelected]}>
          {title}
        </Text>
        {description ? (
          <Text style={[styles.description, isSelected && styles.descriptionSelected]}>
            {description}
          </Text>
        ) : null}
      </View>

      <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
        {isSelected ? (
          <View style={styles.radioInner}>
            <Check size={12} color="#FFFFFF" strokeWidth={3.5} />
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#F5F3FF',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconBoxSelected: {
    backgroundColor: '#EEF2FF',
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
  },
  titleSelected: {
    color: '#312E81',
  },
  description: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginTop: 3,
  },
  descriptionSelected: {
    color: '#4338CA',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioOuterSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#4F46E5',
  },
  radioInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
