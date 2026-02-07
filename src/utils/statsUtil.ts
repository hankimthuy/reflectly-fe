import type { Entry } from '../models/entry';
import type { Emotion } from '../models/emotion';
import { EMOTION_DATA } from '../models/emotion';
import { StreakStatus, STREAK_CONFIG } from '../constants/stats';

// Result type for streak calculation
export interface StreakResult {
  count: number;
  status: StreakStatus;
  icon: string;
  color: string;
  label: string;
}

// Result type for top mood calculation
export interface TopMoodResult {
  emotion: Emotion;
  count: number;
  total: number;
  icon: string;
  label: string;
  color: string;
}

// Result type for emotion distribution
export interface EmotionDistItem {
  emotion: Emotion;
  count: number;
  percentage: number;
  icon: string;
  label: string;
  color: string;
}

/**
 * Maps a streak day count to a StreakStatus based on thresholds.
 */
export const getStreakStatus = (count: number): StreakStatus => {
  if (count <= 0) return StreakStatus.NONE;
  if (count <= 2) return StreakStatus.STARTING;
  if (count <= 6) return StreakStatus.BUILDING;
  if (count <= 13) return StreakStatus.ON_FIRE;
  if (count <= 29) return StreakStatus.BLAZING;
  return StreakStatus.LEGENDARY;
};

/**
 * Calculates the current day streak from a list of entries.
 * Counts consecutive days (from today backwards) that have at least one entry.
 * Includes a 1-day grace period: if today has no entry but yesterday does,
 * the streak still counts from yesterday backwards.
 */
export const calculateDayStreak = (entries: Entry[]): StreakResult => {
  if (!entries.length) {
    const config = STREAK_CONFIG[StreakStatus.NONE];
    return { count: 0, status: StreakStatus.NONE, ...config };
  }

  // Collect unique dates (YYYY-MM-DD) that have entries
  const entryDates = new Set<string>();
  for (const entry of entries) {
    const date = new Date(entry.createdAt);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    entryDates.add(dateStr);
  }

  // Helper to format a Date to YYYY-MM-DD
  const formatDate = (d: Date): string =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const today = new Date();
  const todayStr = formatDate(today);

  // Determine the starting point for counting
  let startDate: Date;
  if (entryDates.has(todayStr)) {
    startDate = today;
  } else {
    // Grace period: check yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (entryDates.has(formatDate(yesterday))) {
      startDate = yesterday;
    } else {
      // No entry today or yesterday — streak is broken
      const config = STREAK_CONFIG[StreakStatus.NONE];
      return { count: 0, status: StreakStatus.NONE, ...config };
    }
  }

  // Count consecutive days backwards from startDate
  let streak = 0;
  const current = new Date(startDate);
  while (entryDates.has(formatDate(current))) {
    streak++;
    current.setDate(current.getDate() - 1);
  }

  const status = getStreakStatus(streak);
  const config = STREAK_CONFIG[status];
  return { count: streak, status, ...config };
};

/**
 * Returns the most frequently occurring emotion across all entries.
 * Returns null if no emotions are found.
 */
export const getTopMood = (entries: Entry[]): TopMoodResult | null => {
  const allEmotions = entries.flatMap(e => e.emotions);
  if (!allEmotions.length) return null;

  // Count frequency of each emotion
  const counts: Record<string, number> = {};
  for (const emotion of allEmotions) {
    counts[emotion] = (counts[emotion] || 0) + 1;
  }

  // Find the emotion with the highest count
  let topEmotion = '';
  let topCount = 0;
  for (const [emotion, count] of Object.entries(counts)) {
    if (count > topCount) {
      topEmotion = emotion;
      topCount = count;
    }
  }

  const emotionData = EMOTION_DATA[topEmotion as Emotion];
  if (!emotionData) return null;

  return {
    emotion: topEmotion as Emotion,
    count: topCount,
    total: allEmotions.length,
    icon: emotionData.icon,
    label: emotionData.label,
    color: emotionData.color,
  };
};

/**
 * Aggregates all emotions from entries and returns a sorted distribution
 * with count and percentage for each emotion.
 * Sorted descending by count. Emotions with 0 count are included at the end.
 */
export const getEmotionDistribution = (entries: Entry[]): EmotionDistItem[] => {
  const allEmotions = entries.flatMap(e => e.emotions);
  const total = allEmotions.length;

  // Count frequency of each emotion
  const counts: Record<string, number> = {};
  for (const emotion of allEmotions) {
    counts[emotion] = (counts[emotion] || 0) + 1;
  }

  // Build distribution for all known emotions
  const distribution: EmotionDistItem[] = Object.entries(EMOTION_DATA).map(([key, data]) => ({
    emotion: key as Emotion,
    count: counts[key] || 0,
    percentage: total > 0 ? Math.round(((counts[key] || 0) / total) * 100) : 0,
    icon: data.icon,
    label: data.label,
    color: data.color,
  }));

  // Sort descending by count
  distribution.sort((a, b) => b.count - a.count);

  return distribution;
};
