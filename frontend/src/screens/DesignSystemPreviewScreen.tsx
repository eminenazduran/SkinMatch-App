import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export const DesignSystemPreviewScreen: React.FC = () => {
  const [loadingBtn, setLoadingBtn] = useState(false);

  const handleSimulateLoading = () => {
    setLoadingBtn(true);
    setTimeout(() => setLoadingBtn(false), 2000);
  };

  return (
    <ScreenWrapper
      title="SkinMatch UI Kiti"
      subtitle="Tasarım Sistemi, Renkler & Bileşen Önizlemesi"
    >
      {/* 1. Renk Paleti Önizleme */}
      <Card variant="elevated" style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🎨 Renk Paleti (Tokens)</Text>
        <View style={styles.colorPaletteRow}>
          <View style={styles.colorItem}>
            <View style={[styles.colorBox, { backgroundColor: colors.primary }]} />
            <Text style={styles.colorLabel}>Primary (Sage)</Text>
          </View>
          <View style={styles.colorItem}>
            <View style={[styles.colorBox, { backgroundColor: colors.secondary }]} />
            <Text style={styles.colorLabel}>Secondary (Rose)</Text>
          </View>
          <View style={styles.colorItem}>
            <View style={[styles.colorBox, { backgroundColor: colors.success }]} />
            <Text style={styles.colorLabel}>Hero / Safe</Text>
          </View>
          <View style={styles.colorItem}>
            <View style={[styles.colorBox, { backgroundColor: colors.warning }]} />
            <Text style={styles.colorLabel}>Warning</Text>
          </View>
          <View style={styles.colorItem}>
            <View style={[styles.colorBox, { backgroundColor: colors.danger }]} />
            <Text style={styles.colorLabel}>Danger</Text>
          </View>
        </View>
      </Card>

      {/* 2. Buton Varyantları */}
      <Card variant="default" style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🔘 Buton Varyantları</Text>
        <View style={styles.componentStack}>
          <Button
            title="Birincil Buton (Primary)"
            variant="primary"
            size="md"
            onPress={handleSimulateLoading}
            loading={loadingBtn}
          />
          <Button
            title="İkincil Buton (Secondary)"
            variant="secondary"
            size="md"
            onPress={() => {}}
          />
          <Button
            title="Çizgili Buton (Outline)"
            variant="outline"
            size="md"
            onPress={() => {}}
          />
          <Button
            title="Uyarı / Tehlike Butonu (Danger)"
            variant="danger"
            size="sm"
            onPress={() => {}}
          />
        </View>
      </Card>

      {/* 3. Badge (Etiket) Varyantları */}
      <Card variant="default" style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🏷️ Rozet / Etiket Varyantları</Text>
        <View style={styles.badgeRow}>
          <Badge label="🌟 Niacinamide (Hero)" variant="hero" />
          <Badge label="✅ Cilt Dostu (Safe)" variant="safe" />
          <Badge label="⚠️ Parfüm (Warning)" variant="warning" />
          <Badge label="🚫 Alkol Denat (Danger)" variant="danger" />
          <Badge label="ℹ️ Bilgilendirme (Info)" variant="info" />
        </View>
      </Card>

      {/* 4. Kart Varyantları */}
      <Text style={[styles.sectionTitle, { marginTop: spacing.md, marginBottom: spacing.sm }]}>
        📦 Kart Varyantları
      </Text>
      <Card variant="default" style={styles.subCard}>
        <Text style={typography.bodyBold}>Default Kart</Text>
        <Text style={typography.caption}>Hafif kenarlıklı ve yumuşak gölgeli standart kart.</Text>
      </Card>

      <Card variant="elevated" style={styles.subCard}>
        <Text style={typography.bodyBold}>Elevated Kart (Yükseltilmiş)</Text>
        <Text style={typography.caption}>Vurgulanmak istenen uyum skoru veya analiz kartları.</Text>
      </Card>

      <Card variant="outlined" style={styles.subCard}>
        <Text style={typography.bodyBold}>Outlined Kart</Text>
        <Text style={typography.caption}>Daha belirgin sınır çizgisine sahip kart konteyneri.</Text>
      </Card>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm + 2,
  },
  colorPaletteRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  colorItem: {
    alignItems: 'center',
    width: '30%',
    marginBottom: spacing.xs,
  },
  colorBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginBottom: 4,
  },
  colorLabel: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  componentStack: {
    gap: spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
  },
  subCard: {
    marginBottom: spacing.sm,
  },
});
