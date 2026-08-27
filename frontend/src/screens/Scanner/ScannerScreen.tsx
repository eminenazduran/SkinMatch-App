import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { scanIngredientsApi } from '../../api/client';
import { IIngredientAnalysisResult } from '../../types';

interface Props {
  onScanComplete?: (result: IIngredientAnalysisResult) => void;
}

export const ScannerScreen: React.FC<Props> = ({ onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualModalVisible, setManualModalVisible] = useState(false);
  const [manualText, setManualText] = useState(
    'Aqua/Water, Nlacinamlde 10%, Zlnc PCA 1%, Dimethicone, Alcohol Denat, Phenoxyethan0l, Parfum/Fragrance, Hyaluronlc Acld.'
  );
  const [productName, setProductName] = useState('Gündüz Bakım Serumu');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyzeText = async (textToScan: string) => {
    setErrorMsg(null);
    setIsScanning(true);
    try {
      const response = await scanIngredientsApi(textToScan, productName, {
        skinType: 'Combination',
        concerns: ['Acne', 'Large Pores'],
        sensitivities: ['Alcohol Denat']
      });

      if (response && response.data && response.data.aiAnalysis) {
        setManualModalVisible(false);
        if (onScanComplete) {
          onScanComplete(response.data.aiAnalysis);
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Tarama analizi yapılamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>İçerik Tarayıcı (OCR)</Text>
        <Text style={styles.headerSubtitle}>
          Kozmetik ürünün arkasındaki INCI listesini vizörün içine hizalayın.
        </Text>
      </View>

      {/* Scanner Viewfinder Box */}
      <View style={styles.viewFinderContainer}>
        <View style={styles.viewFinder}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />

          <View style={styles.laserLine} />

          <Text style={styles.viewFinderHint}>
            İçerik tablosunu (Ingredients) buraya tutun
          </Text>
        </View>
      </View>

      {/* Hata Mesajı */}
      {errorMsg && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      {/* Kontrol Butonları */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.primaryButton, isScanning && styles.buttonDisabled]}
          onPress={() => handleAnalyzeText(manualText)}
          disabled={isScanning}
        >
          {isScanning ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.primaryButtonText}>📸 Fotoğrafı Çek & Tara</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setManualModalVisible(true)}
          disabled={isScanning}
        >
          <Text style={styles.secondaryButtonText}>✏️ Metin Olarak Düzenle / Yapıştır</Text>
        </TouchableOpacity>
      </View>

      {/* Manuel / OCR Düzeltme Modal */}
      <Modal
        visible={manualModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setManualModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>İçerik Metnini İncele / Yapıştır</Text>
            <Text style={styles.modalSubtitle}>
              OCR okuma hatalarını düzeltebilir veya içerik listesini doğrudan yapıştırabilirsiniz.
            </Text>

            <Text style={styles.inputLabel}>Ürün Adı:</Text>
            <TextInput
              style={styles.textInput}
              value={productName}
              onChangeText={setProductName}
              placeholder="Örn: C Vitamini Serumu"
            />

            <Text style={styles.inputLabel}>INCI İçerik Listesi:</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={manualText}
              onChangeText={setManualText}
              placeholder="Aqua, Niacinamide, Glycerin..."
              multiline
              numberOfLines={6}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setManualModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Vazgeç</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={() => handleAnalyzeText(manualText)}
              >
                <Text style={styles.modalSubmitText}>Analiz Et</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    ...typography.h2,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  headerSubtitle: {
    ...typography.caption,
    color: '#94A3B8',
    marginTop: 4,
  },
  viewFinderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  viewFinder: {
    width: '100%',
    height: 260,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: colors.primary,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 14,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 14,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 14,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 14,
  },
  laserLine: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  viewFinderHint: {
    ...typography.caption,
    color: '#CBD5E1',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  errorBox: {
    backgroundColor: colors.dangerBg,
    marginHorizontal: 24,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    textAlign: 'center',
    fontWeight: '600',
  },
  controls: {
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    ...typography.bodyBold,
    color: '#FFFFFF',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    ...typography.body,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  modalTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  modalSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  inputLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.background,
    color: colors.textPrimary,
    marginBottom: 14,
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
  },
  modalCancelText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  modalSubmitButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  modalSubmitText: {
    ...typography.bodyBold,
    color: '#FFFFFF',
  },
});
