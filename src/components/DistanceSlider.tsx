import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '../constants/theme';

const MIN_KM = 1;
const MAX_KM = 100;

interface DistanceSliderProps {
  value: number;
  onChange: (km: number) => void;
  compact?: boolean;
  noPadding?: boolean;
}

function formatDistanceLabel(km: number): string {
  if (km >= MAX_KM) return `${MAX_KM}+ km`;
  return `${km} km`;
}

export function DistanceSlider({
  value,
  onChange,
  compact = false,
  noPadding = false,
}: DistanceSliderProps) {
  return (
    <View
      style={[
        styles.container,
        compact && styles.compact,
        noPadding && styles.noPadding,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.labelRow}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text style={styles.label}>Maximum distance</Text>
        </View>
        <Text style={styles.value}>{formatDistanceLabel(value)}</Text>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={MIN_KM}
        maximumValue={MAX_KM}
        step={1}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.primary}
      />

      {!compact && (
        <View style={styles.rangeLabels}>
          <Text style={styles.rangeText}>{MIN_KM} km</Text>
          <Text style={styles.rangeText}>{MAX_KM}+ km</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  compact: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  noPadding: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  label: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  value: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -spacing.xs,
  },
  rangeText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
});
