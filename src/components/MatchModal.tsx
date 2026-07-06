import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, fontSize, spacing } from '../constants/theme';
import { User } from '../types';

interface MatchModalProps {
  visible: boolean;
  partner: User | null;
  onClose: () => void;
  onChat: () => void;
}

export function MatchModal({ visible, partner, onClose, onChat }: MatchModalProps) {
  if (!partner) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>It's a Match!</Text>
          <Text style={styles.subtitle}>You have a new sparring partner!</Text>

          <View style={styles.avatars}>
            <View style={styles.avatarRing}>
              <Image
                source={{ uri: partner.photos[0] }}
                style={styles.avatar}
              />
            </View>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="boxing-glove" size={28} color={colors.primary} />
            </View>
          </View>

          <Text style={styles.partnerName}>{partner.name}</Text>
          <Text style={styles.hint}>
            Send a message to coordinate gym, time, and sparring rules.
          </Text>

          <Pressable style={styles.chatBtn} onPress={onChat}>
            <Text style={styles.chatBtnText}>Start Chatting</Text>
          </Pressable>

          <Pressable onPress={onClose}>
            <Text style={styles.keepSwiping}>Keep Swiping</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: colors.primary,
    fontSize: fontSize.xxl,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.text,
    fontSize: fontSize.md,
    marginBottom: spacing.xl,
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.primary,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -20,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  partnerName: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  hint: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  chatBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl * 2,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  chatBtnText: {
    color: colors.badgeText,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  keepSwiping: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
});
