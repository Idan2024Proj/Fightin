import { create } from 'zustand';
import {
  Discipline,
  ExperienceLevel,
  Gender,
  ProfileSetupDraft,
  SparringIntensity,
  User,
} from '../types';

interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => void;
  loginWithGoogle: () => void;
  logout: () => void;
  completeProfile: (draft: ProfileSetupDraft) => void;
  updateProfile: (updates: Partial<User>) => void;
}

const DEFAULT_LOCATION = {
  type: 'Point' as const,
  coordinates: [34.7818, 32.0853] as [number, number],
};

const emptyDraft = (): ProfileSetupDraft => ({
  name: '',
  age: '',
  gender: null,
  heightCm: '',
  weightKg: '',
  bio: '',
  disciplines: [],
  experience: null,
  intensity: null,
  gym: '',
  photos: [],
});

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  currentUser: null,

  login: (email: string, _password: string) => {
    set({
      isAuthenticated: true,
      currentUser: {
        id: 'user-1',
        name: 'You',
        email,
        bio: '',
        age: 0,
        gender: Gender.PREFER_NOT_TO_SAY,
        heightCm: 0,
        weightKg: 0,
        location: DEFAULT_LOCATION,
        experience: ExperienceLevel.BEGINNER,
        disciplines: [],
        intensity: SparringIntensity.MODERATE,
        photos: [],
        profileComplete: false,
      },
    });
  },

  loginWithGoogle: () => {
    set({
      isAuthenticated: true,
      currentUser: {
        id: 'user-1',
        name: 'You',
        email: 'user@gmail.com',
        bio: '',
        age: 0,
        gender: Gender.PREFER_NOT_TO_SAY,
        heightCm: 0,
        weightKg: 0,
        location: DEFAULT_LOCATION,
        experience: ExperienceLevel.BEGINNER,
        disciplines: [],
        intensity: SparringIntensity.MODERATE,
        photos: [],
        profileComplete: false,
      },
    });
  },

  logout: () => {
    set({ isAuthenticated: false, currentUser: null });
  },

  completeProfile: (draft: ProfileSetupDraft) => {
    const current = get().currentUser;
    if (!current) return;

    set({
      currentUser: {
        ...current,
        name: draft.name,
        age: parseInt(draft.age, 10) || 0,
        gender: draft.gender ?? Gender.PREFER_NOT_TO_SAY,
        heightCm: parseInt(draft.heightCm, 10) || 0,
        weightKg: parseInt(draft.weightKg, 10) || 0,
        bio: draft.bio,
        disciplines: draft.disciplines,
        experience: draft.experience ?? ExperienceLevel.BEGINNER,
        intensity: draft.intensity ?? SparringIntensity.MODERATE,
        gym: draft.gym.trim() || undefined,
        photos: draft.photos.length > 0 ? draft.photos : current.photos,
        profileComplete: true,
      },
    });
  },

  updateProfile: (updates: Partial<User>) => {
    const current = get().currentUser;
    if (!current) return;
    set({ currentUser: { ...current, ...updates } });
  },
}));

export { emptyDraft };
