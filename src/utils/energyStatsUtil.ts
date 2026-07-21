import type { EnergyLog } from '../models/energyLog';
import { CONTEXT_TAG_DATA, type ContextTag } from '../models/energyLog';

// A single point on the energy trend chart: one local calendar day.
export interface EnergyTrendPoint {
  date: string; // YYYY-MM-DD (local)
  avgLevel: number;
  count: number;
}

// Result type for context tag distribution (avg level + log count per tag).
export interface ContextTagDistItem {
  contextTag: ContextTag;
  label: string;
  icon: string;
  count: number;
  avgLevel: number;
  percentage: number;
}

/**
 * Formats an ISO date string to a local YYYY-MM-DD bucket key.
 * Mirrors the local-date idiom used by statsUtil.calculateDayStreak —
 * bucketing happens in LOCAL time, not UTC.
 */
const formatLocalDate = (isoString: string): string => {
  const date = new Date(isoString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const round1 = (value: number): number => Math.round(value * 10) / 10;

/**
 * Buckets energy logs by local calendar day and returns the daily
 * average energy level, sorted ascending by date (oldest first).
 */
export const getEnergyTrend = (logs: EnergyLog[]): EnergyTrendPoint[] => {
  const buckets = new Map<string, { total: number; count: number }>();

  for (const log of logs) {
    const dateStr = formatLocalDate(log.loggedAt);
    const bucket = buckets.get(dateStr) || { total: 0, count: 0 };
    bucket.total += log.level;
    bucket.count += 1;
    buckets.set(dateStr, bucket);
  }

  return Array.from(buckets.entries())
    .map(([date, { total, count }]) => ({
      date,
      avgLevel: round1(total / count),
      count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Aggregates energy logs by context tag and returns, for every known
 * context tag, the log count, average energy level, and share of total
 * logs. Sorted descending by count. Mirrors statsUtil.getEmotionDistribution.
 */
export const getContextTagDistribution = (logs: EnergyLog[]): ContextTagDistItem[] => {
  const total = logs.length;
  const counts: Record<string, number> = {};
  const totals: Record<string, number> = {};

  for (const log of logs) {
    counts[log.contextTag] = (counts[log.contextTag] || 0) + 1;
    totals[log.contextTag] = (totals[log.contextTag] || 0) + log.level;
  }

  const distribution: ContextTagDistItem[] = Object.entries(CONTEXT_TAG_DATA).map(([key, data]) => {
    const count = counts[key] || 0;
    return {
      contextTag: key as ContextTag,
      label: data.label,
      icon: data.icon,
      count,
      avgLevel: count > 0 ? round1(totals[key] / count) : 0,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  });

  distribution.sort((a, b) => b.count - a.count);

  return distribution;
};

/**
 * Returns the overall average energy level across all logs, or 0 if empty.
 */
export const getAverageEnergyLevel = (logs: EnergyLog[]): number => {
  if (!logs.length) return 0;
  const sum = logs.reduce((acc, log) => acc + log.level, 0);
  return round1(sum / logs.length);
};

/**
 * Returns the context tag with the highest average energy level among
 * tags that have at least one log. Returns null if no logs are tagged.
 */
export const getBestContextTag = (distribution: ContextTagDistItem[]): ContextTagDistItem | null => {
  const logged = distribution.filter((item) => item.count > 0);
  if (!logged.length) return null;

  return logged.reduce((best, item) => (item.avgLevel > best.avgLevel ? item : best), logged[0]);
};
