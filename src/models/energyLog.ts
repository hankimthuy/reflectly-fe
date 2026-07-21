export const ContextTag = {
  WORK: 'work',
  SOCIAL: 'social',
  REST: 'rest',
  EXERCISE: 'exercise',
  CREATIVE: 'creative',
  LEARNING: 'learning',
  FAMILY: 'family',
  ALONE: 'alone'
} as const;

export type ContextTag = typeof ContextTag[keyof typeof ContextTag];

export interface ContextTagData {
  id: ContextTag;
  label: string;
  icon: string;
}

export const CONTEXT_TAG_DATA: Record<ContextTag, ContextTagData> = {
  [ContextTag.WORK]: { id: ContextTag.WORK, label: 'Work', icon: '💼' },
  [ContextTag.SOCIAL]: { id: ContextTag.SOCIAL, label: 'Social', icon: '👥' },
  [ContextTag.REST]: { id: ContextTag.REST, label: 'Rest', icon: '🛋️' },
  [ContextTag.EXERCISE]: { id: ContextTag.EXERCISE, label: 'Exercise', icon: '🏃' },
  [ContextTag.CREATIVE]: { id: ContextTag.CREATIVE, label: 'Creative', icon: '🎨' },
  [ContextTag.LEARNING]: { id: ContextTag.LEARNING, label: 'Learning', icon: '📚' },
  [ContextTag.FAMILY]: { id: ContextTag.FAMILY, label: 'Family', icon: '👨‍👩‍👧' },
  [ContextTag.ALONE]: { id: ContextTag.ALONE, label: 'Alone', icon: '🧘' }
};

export interface EnergyLog {
  id: string;
  userId: string;
  level: number;
  contextTag: string;
  notes?: string;
  loggedAt: string;
  createdAt: string;
}

export interface CreateEnergyLogRequest {
  level: number;
  contextTag: string;
  notes?: string;
}
