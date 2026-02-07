// Streak status thresholds
export const StreakStatus = {
  NONE: 'none',           // 0 days
  STARTING: 'starting',   // 1-2 days
  BUILDING: 'building',   // 3-6 days
  ON_FIRE: 'on_fire',     // 7-13 days
  BLAZING: 'blazing',     // 14-29 days
  LEGENDARY: 'legendary', // 30+ days
} as const;

export type StreakStatus = typeof StreakStatus[keyof typeof StreakStatus];

// Display configuration for each streak status
export const STREAK_CONFIG: Record<StreakStatus, { icon: string; color: string; label: string }> = {
  [StreakStatus.NONE]:      { icon: '💤', color: '#64748B', label: 'No Streak' },
  [StreakStatus.STARTING]:  { icon: '🌱', color: '#10B981', label: 'Starting' },
  [StreakStatus.BUILDING]:  { icon: '🔥', color: '#F59E0B', label: 'Building' },
  [StreakStatus.ON_FIRE]:   { icon: '🔥', color: '#F97316', label: 'On Fire' },
  [StreakStatus.BLAZING]:   { icon: '🔥', color: '#EF4444', label: 'Blazing' },
  [StreakStatus.LEGENDARY]: { icon: '⚡', color: '#8B5CF6', label: 'Legendary' },
};

// Stat card types used across the app
export const StatType = {
  DAY_STREAK: 'day_streak',
  TOP_MOOD: 'top_mood',
  TOTAL_ENTRIES: 'total_entries',
} as const;

export type StatType = typeof StatType[keyof typeof StatType];
