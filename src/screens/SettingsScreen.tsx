import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppLogo } from '../components/AppLogo';
import { Button } from '../components/Button';
import { FilterModal } from '../components/FilterModal';
import { borderRadius, colors, fontSize, spacing } from '../constants/theme';
import { useAuthStore } from '../store/useAuthStore';
import { useDiscoveryStore } from '../store/useDiscoveryStore';

export function SettingsScreen() {
  const { logout } = useAuthStore();
  const resetDiscovery = useDiscoveryStore((s) => s.resetDiscovery);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleLogout = () => {
    logout();
    resetDiscovery();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <AppLogo size="sm" />
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Pressable style={styles.row} onPress={() => setFiltersOpen(true)}>
          <Ionicons name="options-outline" size={22} color={colors.primary} />
          <Text style={styles.rowText}>Discovery Filters</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>

        <Pressable style={styles.row}>
          <Ionicons name="location-outline" size={22} color={colors.primary} />
          <Text style={styles.rowText}>Location Preferences</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>

        <Pressable style={styles.row}>
          <Ionicons name="notifications-outline" size={22} color={colors.primary} />
          <Text style={styles.rowText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>

        <Pressable style={styles.row}>
          <Ionicons name="shield-outline" size={22} color={colors.primary} />
          <Text style={styles.rowText}>Safety & Privacy</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>

        <View style={styles.versionBox}>
          <Text style={styles.version}>SparrMatch v1.0.0</Text>
        </View>

        <Button
          title="Log Out"
          variant="outline"
          onPress={handleLogout}
          style={styles.logoutBtn}
        />
      </ScrollView>

      <FilterModal visible={filtersOpen} onClose={() => setFiltersOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  rowText: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '500',
  },
  versionBox: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  version: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  logoutBtn: {
    marginTop: spacing.sm,
  },
});
