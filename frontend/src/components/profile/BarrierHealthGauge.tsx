import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react-native';
import { useLanguage } from '../../context/LanguageContext';

interface BarrierHealthGaugeProps {
  score: number; // 0 - 100
  statusText?: string;
  size?: number;
}

export const BarrierHealthGauge: React.FC<BarrierHealthGaugeProps> = ({
  score = 75,
  statusText,
  size = 150,
}) => {
  const { language } = useLanguage();

  const isHealthy = score >= 75;
  const isCompromised = score >= 50 && score < 75;
  const isCritical = score < 50;

  const ringColor = isHealthy ? '#10B981' : isCompromised ? '#4F46E5' : '#EF4444';
  const trackColor = isHealthy ? '#D1FAE5' : isCompromised ? '#EEF2FF' : '#FEE2E2';

  const defaultBadgeText = (() => {
    if (isHealthy) {
      return language === 'tr' ? 'İdeal & Dayanıklı' : 'Ideal & Resilient';
    }
    if (isCompromised) {
      return language === 'tr' ? 'Dengelenme & Onarım Sürecinde' : 'Compromised / Rebalancing';
    }
    return language === 'tr' ? 'Acil Onarım Gerektiriyor' : 'Needs Urgent Repair';
  })();

  const renderIcon = () => {
    if (isHealthy) return <ShieldCheck size={16} color={ringColor} />;
    if (isCompromised) return <ShieldCheck size={16} color={ringColor} />;
    return <AlertTriangle size={16} color={ringColor} />;
  };

  return (
    <View style={styles.container}>
      {/* 1. Dairesel Gösterge Halkası */}
      <View style={[styles.gaugeContainer, { width: size, height: size }]}>
        <View
          style={[
            styles.gaugeOuterRing,
            {
              width: size - 8,
              height: size - 8,
              borderRadius: (size - 8) / 2,
              borderColor: trackColor,
              borderTopColor: ringColor,
              borderRightColor: ringColor,
              borderBottomColor: score >= 60 ? ringColor : trackColor,
            },
          ]}
        >
          <View style={styles.gaugeInnerContent}>
            <Text style={[styles.gaugePercentNumber, { color: ringColor }]}>%{score}</Text>
            <Text style={styles.gaugeLabel}>
              {language === 'tr' ? 'BARİYER SKORU' : 'BARRIER SCORE'}
            </Text>
          </View>
        </View>
      </View>

      {/* 2. Durum Rozeti */}
      <View style={[styles.barrierBadgeRow, { backgroundColor: trackColor }]}>
        {renderIcon()}
        <Text style={[styles.barrierBadgeText, { color: ringColor }]}>
          {statusText || defaultBadgeText}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 12,
  },
  gaugeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gaugeOuterRing: {
    borderWidth: 12,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-45deg' }],
  },
  gaugeInnerContent: {
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
  },
  gaugePercentNumber: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  gaugeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  barrierBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
  },
  barrierBadgeText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
});
