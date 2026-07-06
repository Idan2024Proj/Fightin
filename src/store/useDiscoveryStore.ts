import { create } from 'zustand';
import { MOCK_CANDIDATES, MOCK_MUTUAL_LIKE_IDS } from '../data/mockData';
import {
  Discipline,
  DiscoveryFilters,
  SwipeAction,
  User,
} from '../types';
import { calculateDistanceKm } from '../utils/distance';
import { useAuthStore } from './useAuthStore';
import { useMatchStore } from './useMatchStore';

interface DiscoveryState {
  candidates: User[];
  passedIds: Set<string>;
  likedIds: Set<string>;
  filters: DiscoveryFilters;
  pendingMatch: User | null;
  setFilters: (filters: Partial<DiscoveryFilters>) => void;
  getFilteredCandidates: () => User[];
  swipe: (userId: string, action: SwipeAction) => void;
  clearPendingMatch: () => void;
  resetDiscovery: () => void;
}

const DEFAULT_FILTERS: DiscoveryFilters = {
  maxDistanceKm: 20,
  discipline: null,
  weightToleranceKg: 5,
};

function filterCandidates(
  candidates: User[],
  passedIds: Set<string>,
  likedIds: Set<string>,
  filters: DiscoveryFilters,
  currentUser: User | null,
): User[] {
  return candidates.filter((candidate) => {
    if (passedIds.has(candidate.id) || likedIds.has(candidate.id)) {
      return false;
    }

    if (filters.discipline && !candidate.disciplines.includes(filters.discipline)) {
      return false;
    }

    if (currentUser && currentUser.weightKg > 0) {
      const weightDiff = Math.abs(candidate.weightKg - currentUser.weightKg);
      if (weightDiff > filters.weightToleranceKg) {
        return false;
      }
    }

    if (currentUser) {
      const distance = calculateDistanceKm(currentUser.location, candidate.location);
      if (distance > filters.maxDistanceKm) {
        return false;
      }
    }

    return true;
  });
}

export const useDiscoveryStore = create<DiscoveryState>((set, get) => ({
  candidates: MOCK_CANDIDATES,
  passedIds: new Set(),
  likedIds: new Set(),
  filters: DEFAULT_FILTERS,
  pendingMatch: null,

  setFilters: (partial) => {
    set((state) => ({ filters: { ...state.filters, ...partial } }));
  },

  getFilteredCandidates: () => {
    const { candidates, passedIds, likedIds, filters } = get();
    const currentUser = useAuthStore.getState().currentUser;
    return filterCandidates(candidates, passedIds, likedIds, filters, currentUser);
  },

  swipe: (userId: string, action: SwipeAction) => {
    const candidate = get().candidates.find((c) => c.id === userId);
    if (!candidate) return;

    if (action === SwipeAction.PASS) {
      set((state) => {
        const passedIds = new Set(state.passedIds);
        passedIds.add(userId);
        return { passedIds };
      });
      return;
    }

    set((state) => {
      const likedIds = new Set(state.likedIds);
      likedIds.add(userId);
      return { likedIds };
    });

    if (MOCK_MUTUAL_LIKE_IDS.has(userId)) {
      const currentUser = useAuthStore.getState().currentUser;
      if (currentUser) {
        useMatchStore.getState().addMatch(candidate, currentUser.id);
      }
      set({ pendingMatch: candidate });
    }
  },

  clearPendingMatch: () => set({ pendingMatch: null }),

  resetDiscovery: () => {
    set({
      passedIds: new Set(),
      likedIds: new Set(),
      filters: DEFAULT_FILTERS,
      pendingMatch: null,
    });
  },
}));
