import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Lightbulb, Scan } from 'lucide-react-native';
import { useLanguage } from '../../context/LanguageContext';

const { width, height } = Dimensions.get('window');
const OVAL_WIDTH = width * 0.72;
const OVAL_HEIGHT = OVAL_WIDTH * 1.35;

interface FaceOverlayGuideProps {
  instructionText?: string;
}

export const FaceOverlayGuide: React.FC<FaceOverlayGuideProps> = ({ instructionText }) => {
  const { language } = useLanguage();

  const defaultHint =
    language === 'tr'
      ? 'İyi aydınlatılmış bir alanda, makyajsız yüzünüzü çerçeveye hizalayın'
      : 'In a well-lit area, align your bare face within the frame';

  return (
    <View style={styles.overlayContainer} pointerEvents="none">
      {/* 1. Üst Aydınlatma İpucu Rozeti */}
      <View style={styles.tipCard}>
        <Lightbulb size={16} color="#FBBF24" />
        <Text style={styles.tipText}>{instructionText || defaultHint}</Text>
      </View>

      {/* 2. Oval Yüz Çerçevesi (Viewfinder Oval) */}
      <View style={styles.ovalWrapper}>
        <View style={styles.ovalFrame}>
          {/* Köşe Hizalama Vurguları */}
          <View style={[styles.cornerMarker, styles.cornerTopLeft]} />
          <View style={[styles.cornerMarker, styles.cornerTopRight]} />
          <View style={[styles.cornerMarker, styles.cornerBottomLeft]} />
          <View style={[styles.cornerMarker, styles.cornerBottomRight]} />

          {/* Göz ve Merkez Kılavuz Çizgileri */}
          <View style={styles.eyeLevelGuide}>
            <View style={styles.guideDot} />
            <View style={styles.guideLine} />
            <View style={styles.guideDot} />
          </View>
          <View style={styles.verticalCenterGuide} />
        </View>
      </View>

      {/* 3. Alt Canlı Durum Rozeti */}
      <View style={styles.bottomStatusRow}>
        <Scan size={14} color="#A5B4FC" />
        <Text style={styles.bottomStatusText}>
          {language === 'tr' ? 'DERMA-VISION YÜZ ALGILAYICI AKTİF' : 'DERMA-VISION FACE SENSOR ACTIVE'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  tipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#F8FAFC',
    flexShrink: 1,
    lineHeight: 18,
    textAlign: 'center',
  },
  ovalWrapper: {
    width: OVAL_WIDTH,
    height: OVAL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ovalFrame: {
    width: '100%',
    height: '100%',
    borderRadius: OVAL_WIDTH / 2,
    borderWidth: 2,
    borderColor: 'rgba(99, 102, 241, 0.8)',
    backgroundColor: 'transparent',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
  },
  cornerMarker: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderColor: '#FDE047',
  },
  cornerTopLeft: {
    top: 24,
    left: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 6,
  },
  cornerTopRight: {
    top: 24,
    right: 24,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 6,
  },
  cornerBottomLeft: {
    bottom: 24,
    left: 24,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 6,
  },
  cornerBottomRight: {
    bottom: 24,
    right: 24,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 6,
  },
  eyeLevelGuide: {
    position: 'absolute',
    top: '38%',
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  guideLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginHorizontal: 8,
  },
  guideDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(253, 224, 71, 0.8)',
  },
  verticalCenterGuide: {
    position: 'absolute',
    top: '20%',
    bottom: '20%',
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  bottomStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  bottomStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C7D2FE',
    letterSpacing: 1,
  },
});
