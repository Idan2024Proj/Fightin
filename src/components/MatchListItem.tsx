import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, fontSize, spacing } from '../constants/theme';
import { Match } from '../types';

interface MatchListItemProps {
  match: Match;
  onPress: () => void;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function MatchListItem({ match, onPress }: MatchListItemProps) {
  const { partner, lastMessage } = match;
  const hasUnread = lastMessage && !lastMessage.read;

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: partner.photos[0] }}
        style={styles.avatar}
      />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.name}>{partner.name}</Text>
          {lastMessage && (
            <Text style={styles.time}>{formatTime(lastMessage.timestamp)}</Text>
          )}
        </View>
        {lastMessage ? (
          <Text
            style={[styles.preview, hasUnread && styles.previewUnread]}
            numberOfLines={1}
          >
            {lastMessage.text}
          </Text>
        ) : (
          <Text style={styles.preview}>Say hello to your new sparring partner!</Text>
        )}
      </View>
      {hasUnread && <View style={styles.unreadDot} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceLight,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  time: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  preview: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  previewUnread: {
    color: colors.text,
    fontWeight: '600',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },
});
