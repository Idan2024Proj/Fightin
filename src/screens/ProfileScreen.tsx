import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../components/Input';
import { PhotoPickerGrid } from '../components/PhotoPickerGrid';
import {
  disciplineLabels,
  experienceLabels,
  intensityLabels,
} from '../constants/labels';
import { borderRadius, colors, fontSize, spacing } from '../constants/theme';
import { useAuthStore } from '../store/useAuthStore';

export function ProfileScreen() {
  const { currentUser, updateProfile } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(currentUser?.bio ?? '');
  const [weight, setWeight] = useState(String(currentUser?.weightKg ?? ''));
  const [gym, setGym] = useState(currentUser?.gym ?? '');
  const [photos, setPhotos] = useState<string[]>(currentUser?.photos ?? []);

  if (!currentUser) return null;

  const handleSave = () => {
    updateProfile({
      bio,
      gym: gym.trim() || undefined,
      weightKg: parseInt(weight, 10) || currentUser.weightKg,
      photos,
    });
    setEditing(false);
  };

  const startEditing = () => {
    setBio(currentUser.bio);
    setWeight(String(currentUser.weightKg));
    setGym(currentUser.gym ?? '');
    setPhotos(currentUser.photos);
    setEditing(true);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {(editing ? photos[0] : currentUser.photos[0]) ? (
              <Image
                source={{ uri: (editing ? photos[0] : currentUser.photos[0]) }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={48} color={colors.textMuted} />
              </View>
            )}
          </View>
          <Text style={styles.name}>{currentUser.name}</Text>
          <Text style={styles.email}>{currentUser.email}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{currentUser.weightKg}kg</Text>
            <Text style={styles.statLabel}>Weight</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{currentUser.heightCm}cm</Text>
            <Text style={styles.statLabel}>Height</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{currentUser.age}</Text>
            <Text style={styles.statLabel}>Age</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <Pressable onPress={() => (editing ? handleSave() : startEditing())}>
              <Text style={styles.editLink}>{editing ? 'Save' : 'Edit'}</Text>
            </Pressable>
          </View>

          {editing ? (
            <>
              <Input
                label="Bio"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
              />
              <Input
                label="Home Gym"
                placeholder="e.g. Elite Combat TLV"
                value={gym}
                onChangeText={setGym}
              />
              <Input
                label="Weight (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="number-pad"
              />
              <Text style={styles.photosLabel}>Photos</Text>
              <PhotoPickerGrid photos={photos} onChange={setPhotos} />
            </>
          ) : (
            <>
              <Text style={styles.bio}>
                {currentUser.bio || 'No bio yet.'}
              </Text>
              {currentUser.gym ? (
                <Text style={styles.gym}>🥊 {currentUser.gym}</Text>
              ) : null}
              <Text style={styles.meta}>
                {experienceLabels[currentUser.experience]} ·{' '}
                {intensityLabels[currentUser.intensity]}
              </Text>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disciplines</Text>
          <View style={styles.tags}>
            {currentUser.disciplines.map((d) => (
              <View key={d} style={styles.tag}>
                <Text style={styles.tagText}>{disciplineLabels[d]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.locationText}>
            Sharing location for nearby matchmaking
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.border,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  email: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  editLink: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  photosLabel: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  bio: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  gym: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  meta: {
    color: colors.accent,
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: {
    color: colors.text,
    fontSize: fontSize.sm,
  },
  locationText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
});
