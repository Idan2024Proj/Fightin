import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { borderRadius, colors, fontSize, spacing } from '../constants/theme';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
  isOwn: boolean;
}

function formatMessageTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ChatBubble({ message, isOwn }: ChatBubbleProps) {
  return (
    <View style={[styles.row, isOwn && styles.rowOwn]}>
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        <Text style={[styles.text, isOwn && styles.textOwnDark]}>{message.text}</Text>
        <View style={styles.meta}>
          <Text style={[styles.time, isOwn && styles.timeOwn]}>
            {formatMessageTime(message.timestamp)}
          </Text>
          {isOwn && (
            <Ionicons
              name={message.read ? 'checkmark-done' : 'checkmark'}
              size={14}
              color={message.read ? colors.accent : colors.textMuted}
              style={styles.readIcon}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  rowOwn: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  bubbleOwn: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: spacing.xs,
  },
  textOwnDark: {
    color: colors.badgeText,
  },
  bubbleOther: {
    backgroundColor: colors.surfaceLight,
    borderBottomLeftRadius: spacing.xs,
  },
  text: {
    color: colors.text,
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.xs,
  },
  time: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  timeOwn: {
    color: 'rgba(255,255,255,0.7)',
  },
  readIcon: {
    marginLeft: spacing.xs,
  },
});
