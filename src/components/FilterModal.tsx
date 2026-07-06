import { Ionicons } from '@expo/vector-icons';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DistanceSlider } from './DistanceSlider';
import { disciplineLabels } from '../constants/labels';
import { borderRadius, colors, fontSize, spacing } from '../constants/theme';
import { useDiscoveryStore } from '../store/useDiscoveryStore';
import { Discipline } from '../types';

const WEIGHT_OPTIONS = [3, 5, 10];

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

export function FilterModal({ visible, onClose }: FilterModalProps) {
  const { filters, setFilters } = useDiscoveryStore();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Discovery Filters</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <DistanceSlider
              noPadding
              value={filters.maxDistanceKm}
              onChange={(maxDistanceKm) => setFilters({ maxDistanceKm })}
            />

            <Text style={styles.sectionLabel}>Weight Class (±kg)</Text>
            <View style={styles.chipRow}>
              {WEIGHT_OPTIONS.map((kg) => (
                <Pressable
                  key={kg}
                  style={[
                    styles.chip,
                    filters.weightToleranceKg === kg && styles.chipActive,
                  ]}
                  onPress={() => setFilters({ weightToleranceKg: kg })}
                >
                  <Text
                    style={[
                      styles.chipText,
                      filters.weightToleranceKg === kg && styles.chipTextActive,
                    ]}
                  >
                    ±{kg}kg
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Discipline</Text>
            <View style={styles.chipRow}>
              <Pressable
                style={[styles.chip, !filters.discipline && styles.chipActive]}
                onPress={() => setFilters({ discipline: null })}
              >
                <Text
                  style={[
                    styles.chipText,
                    !filters.discipline && styles.chipTextActive,
                  ]}
                >
                  All
                </Text>
              </Pressable>
              {Object.values(Discipline).map((d) => (
                <Pressable
                  key={d}
                  style={[
                    styles.chip,
                    filters.discipline === d && styles.chipActive,
                  ]}
                  onPress={() => setFilters({ discipline: d })}
                >
                  <Text
                    style={[
                      styles.chipText,
                      filters.discipline === d && styles.chipTextActive,
                    ]}
                  >
                    {disciplineLabels[d]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <Pressable style={styles.applyBtn} onPress={onClose}>
            <Text style={styles.applyText}>Apply Filters</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '75%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  chipTextActive: {
    color: colors.badgeText,
    fontWeight: '700',
  },
  applyBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  applyText: {
    color: colors.badgeText,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
