export enum ExperienceLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  PRO = 'PRO',
}

export enum Discipline {
  BOXING = 'BOXING',
  KICKBOXING = 'KICKBOXING',
  MUAY_THAI = 'MUAY_THAI',
  BJJ = 'BJJ',
  MMA = 'MMA',
  WRESTLING = 'WRESTLING',
}

export enum SparringIntensity {
  LIGHT = 'LIGHT',
  MODERATE = 'MODERATE',
  HARD = 'HARD',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

export enum SwipeAction {
  LIKE = 'LIKE',
  PASS = 'PASS',
}

export interface GeoLocation {
  type: 'Point';
  coordinates: [number, number];
}

export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  location: GeoLocation;
  experience: ExperienceLevel;
  disciplines: Discipline[];
  intensity: SparringIntensity;
  photos: string[];
  city?: string;
  gym?: string;
  profileComplete: boolean;
}

export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: string;
  partner: User;
  lastMessage?: Message;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface DiscoveryFilters {
  maxDistanceKm: number;
  discipline: Discipline | null;
  weightToleranceKg: number;
}

export interface ProfileSetupDraft {
  name: string;
  age: string;
  gender: Gender | null;
  heightCm: string;
  weightKg: string;
  bio: string;
  disciplines: Discipline[];
  experience: ExperienceLevel | null;
  intensity: SparringIntensity | null;
  gym: string;
  photos: string[];
}
