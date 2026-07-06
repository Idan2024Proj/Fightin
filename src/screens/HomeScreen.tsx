import { Ionicons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppLogo } from '../components/AppLogo';
import { DistanceSlider } from '../components/DistanceSlider';
import { FilterModal } from '../components/FilterModal';
import { MatchModal } from '../components/MatchModal';
import { NotificationBadge } from '../components/NotificationBadge';
import { SwipeDeck } from '../components/SwipeDeck';
import { colors, spacing } from '../constants/theme';
import { MainStackParamList, MainTabParamList } from '../navigation/types';
import { useDiscoveryStore } from '../store/useDiscoveryStore';
import { useMatchStore } from '../store/useMatchStore';
import { SwipeAction } from '../types';

type HomeNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Cards'>,
  NativeStackNavigationProp<MainStackParamList>
>;

export function HomeScreen() {
  const navigation = useNavigation<HomeNav>();
  const { getFilteredCandidates, swipe, pendingMatch, clearPendingMatch, filters, setFilters } =
    useDiscoveryStore();
  const matches = useMatchStore((s) => s.matches);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const candidates = getFilteredCandidates();
  const unreadCount = matches.filter(
    (m) => m.lastMessage && !m.lastMessage.read,
  ).length;

  const handleSwipe = (userId: string, action: SwipeAction) => {
    swipe(userId, action);
  };

  const handleChat = () => {
    if (!pendingMatch) return;
    const match = matches.find((m) => m.partner.id === pendingMatch.id);
    clearPendingMatch();
    if (match) {
      navigation.navigate('Chat', {
        matchId: match.id,
        partnerName: pendingMatch.name,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerBtn}
          onPress={() => setFiltersOpen(true)}
          hitSlop={8}
        >
          <Ionicons name="settings-outline" size={24} color={colors.textMuted} />
        </Pressable>

        <AppLogo size="md" />

        <Pressable
          style={styles.headerBtn}
          onPress={() => navigation.navigate('Matches')}
          hitSlop={8}
        >
          <Ionicons name="chatbubble-outline" size={24} color={colors.textMuted} />
          <NotificationBadge count={unreadCount} />
        </Pressable>
      </View>

      <DistanceSlider
        compact
        value={filters.maxDistanceKm}
        onChange={(maxDistanceKm) => setFilters({ maxDistanceKm })}
      />

      <View style={styles.deckContainer}>
        <SwipeDeck
          candidates={candidates}
          onSwipe={handleSwipe}
          onMessage={() => navigation.navigate('Matches')}
        />
      </View>

      <FilterModal visible={filtersOpen} onClose={() => setFiltersOpen(false)} />

      <MatchModal
        visible={pendingMatch !== null}
        partner={pendingMatch}
        onClose={clearPendingMatch}
        onChat={handleChat}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deckContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
});
