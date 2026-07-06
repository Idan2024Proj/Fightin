import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, fontSize, spacing } from '../constants/theme';
import { SwipeAction, User } from '../types';
import { SwipeCard } from './SwipeCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const ROTATION_ANGLE = 10;

interface SwipeDeckProps {
  candidates: User[];
  onSwipe: (userId: string, action: SwipeAction) => void;
  onMessage?: () => void;
}

export function SwipeDeck({ candidates, onSwipe, onMessage }: SwipeDeckProps) {
  const currentUser = candidates[0];
  const nextUser = candidates[1];

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const handleSwipeComplete = useCallback(
    (action: SwipeAction) => {
      if (!currentUser) return;
      onSwipe(currentUser.id, action);
      translateX.value = 0;
      translateY.value = 0;
    },
    [currentUser, onSwipe, translateX, translateY],
  );

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.25;
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 250 }, () => {
          runOnJS(handleSwipeComplete)(SwipeAction.LIKE);
        });
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 250 }, () => {
          runOnJS(handleSwipeComplete)(SwipeAction.PASS);
        });
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const topCardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-ROTATION_ANGLE, 0, ROTATION_ANGLE],
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const likeOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1]),
  }));

  const passOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0]),
  }));

  const triggerSwipe = (action: SwipeAction) => {
    const direction = action === SwipeAction.LIKE ? 1 : -1;
    translateX.value = withTiming(direction * SCREEN_WIDTH * 1.5, { duration: 250 }, () => {
      runOnJS(handleSwipeComplete)(action);
    });
  };

  if (!currentUser) {
    return (
      <View style={styles.empty}>
        <Ionicons name="albums-outline" size={64} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>No more fighters nearby</Text>
        <Text style={styles.emptySubtitle}>
          Try adjusting your filters or check back later.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.deck}>
        {nextUser && (
          <View style={[styles.cardWrapper, styles.cardBehind]}>
            <SwipeCard user={nextUser} />
          </View>
        )}

        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.cardWrapper, topCardStyle]}>
            <SwipeCard user={currentUser} />
            <Animated.View style={[styles.overlay, styles.likeOverlay, likeOverlayStyle]}>
              <Text style={styles.likeLabel}>SPAR</Text>
            </Animated.View>
            <Animated.View style={[styles.overlay, styles.passOverlay, passOverlayStyle]}>
              <Text style={styles.passLabel}>PASS</Text>
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.actionBtn, styles.passBtn]}
          onPress={() => triggerSwipe(SwipeAction.PASS)}
        >
          <Ionicons name="close" size={30} color={colors.text} />
        </Pressable>

        <View style={styles.likeGlow}>
          <Pressable
            style={[styles.actionBtn, styles.likeBtn]}
            onPress={() => triggerSwipe(SwipeAction.LIKE)}
          >
            <MaterialCommunityIcons name="boxing-glove" size={34} color="#000000" />
          </Pressable>
        </View>

        <Pressable
          style={[styles.actionBtn, styles.messageBtn]}
          onPress={onMessage}
        >
          <Ionicons name="chatbubble" size={26} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  deck: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cardBehind: {
    transform: [{ scale: 0.96 }],
    opacity: 0.5,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 3,
  },
  likeOverlay: {
    borderColor: colors.primary,
  },
  passOverlay: {
    borderColor: colors.pass,
  },
  likeLabel: {
    color: colors.primary,
    fontSize: fontSize.xl,
    fontWeight: '800',
    letterSpacing: 3,
    transform: [{ rotate: '-12deg' }],
  },
  passLabel: {
    color: colors.pass,
    fontSize: fontSize.xl,
    fontWeight: '800',
    letterSpacing: 3,
    transform: [{ rotate: '12deg' }],
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  passBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.passBg,
  },
  likeGlow: {
    borderRadius: 44,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 18,
    elevation: 14,
  },
  likeBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primary,
  },
  messageBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.messageBg,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginTop: spacing.md,
  },
  emptySubtitle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
