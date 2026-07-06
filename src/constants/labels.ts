import { Discipline, ExperienceLevel, Gender, SparringIntensity } from '../types';

export const disciplineEmojis: Record<Discipline, string> = {
  [Discipline.BOXING]: '🥊',
  [Discipline.KICKBOXING]: '🥊',
  [Discipline.MUAY_THAI]: '🥊',
  [Discipline.BJJ]: '🥋',
  [Discipline.MMA]: '🥊',
  [Discipline.WRESTLING]: '🤼',
};

export const disciplineLabels: Record<Discipline, string> = {
  [Discipline.BOXING]: 'Boxing',
  [Discipline.KICKBOXING]: 'Kickboxing',
  [Discipline.MUAY_THAI]: 'Muay Thai',
  [Discipline.BJJ]: 'BJJ',
  [Discipline.MMA]: 'MMA',
  [Discipline.WRESTLING]: 'Wrestling',
};

export const experienceLabels: Record<ExperienceLevel, string> = {
  [ExperienceLevel.BEGINNER]: 'Beginner',
  [ExperienceLevel.INTERMEDIATE]: 'Intermediate',
  [ExperienceLevel.ADVANCED]: 'Advanced',
  [ExperienceLevel.PRO]: 'Pro',
};

export const intensityLabels: Record<SparringIntensity, string> = {
  [SparringIntensity.LIGHT]: 'Technical / Light',
  [SparringIntensity.MODERATE]: 'Moderate',
  [SparringIntensity.HARD]: 'Hard / Fight Prep',
};

export function formatDisciplines(disciplines: Discipline[]): string {
  return disciplines
    .map((d) => `${disciplineEmojis[d]} ${disciplineLabels[d]}`)
    .join(' | ');
}

export const genderLabels: Record<Gender, string> = {
  [Gender.MALE]: 'Male',
  [Gender.FEMALE]: 'Female',
  [Gender.OTHER]: 'Other',
  [Gender.PREFER_NOT_TO_SAY]: 'Prefer not to say',
};
