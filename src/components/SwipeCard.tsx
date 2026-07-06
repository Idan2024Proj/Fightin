import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View } from 'react-native';
import { experienceLabels, formatDisciplines } from '../constants/labels';
import { borderRadius, colors, fontSize, spacing } from '../constants/theme';
import { useAuthStore } from '../store/useAuthStore';
import { User } from '../types';
import { calculateDistanceKm, formatDistance } from '../utils/distance';

interface SwipeCardProps {
  user: User;
}

export function SwipeCard({ user }: SwipeCardProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const distance = currentUser
    ? calculateDistanceKm(currentUser.location, user.location)
    : 0;

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: user.photos[0] ?? 'https://picsum.photos/600/800' }}
        style={styles.image}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.92)']}
        locations={[0.35, 0.65, 1]}
        style={styles.gradient}
      />
      <View style={styles.info}>
        <Text style={styles.name}>
          {user.name.toUpperCase()}, {user.age}
        </Text>

        <Text style={styles.disciplines}>
          {formatDisciplines(user.disciplines)}
        </Text>

        <Text style={styles.stats}>
          {experienceLabels[user.experience]} | {user.heightCm} cm |{' '}
          {user.weightKg} kg
        </Text>

        <Text style={styles.location}>
          {user.city ?? 'Nearby'}, {formatDistance(distance)} away
        </Text>

        {user.gym ? (
          <Text style={styles.gym}>🥊 {user.gym}</Text>
        ) : null}

        {user.bio ? (
          <Text style={styles.bio} numberOfLines={3}>
            Bio: {user.bio}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '62%',
  },
  info: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  disciplines: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '500',
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  stats: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  location: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  gym: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  bio: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
});
