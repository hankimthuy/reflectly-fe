import { describe, it, expect } from 'vitest';
import {
  getEnergyTrend,
  getContextTagDistribution,
  getAverageEnergyLevel,
  getBestContextTag,
} from '../energyStatsUtil';
import { ContextTag, CONTEXT_TAG_DATA } from '../../models/energyLog';
import type { EnergyLog } from '../../models/energyLog';

const makeLog = (overrides: Partial<EnergyLog>): EnergyLog => ({
  id: overrides.id || Math.random().toString(36),
  userId: 'user-1',
  level: 5,
  contextTag: ContextTag.WORK,
  loggedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  ...overrides,
});

// Builds an ISO string for a specific local date/time so tests are
// independent of the machine's timezone offset math.
const localIso = (year: number, month: number, day: number, hour = 12): string => {
  return new Date(year, month - 1, day, hour, 0, 0).toISOString();
};

describe('energyStatsUtil', () => {
  describe('getEnergyTrend', () => {
    it('returns an empty array for no logs', () => {
      expect(getEnergyTrend([])).toEqual([]);
    });

    it('buckets logs by local calendar day and averages the level', () => {
      const logs: EnergyLog[] = [
        makeLog({ level: 4, loggedAt: localIso(2026, 7, 18) }),
        makeLog({ level: 8, loggedAt: localIso(2026, 7, 18, 20) }),
        makeLog({ level: 6, loggedAt: localIso(2026, 7, 19) }),
      ];

      const trend = getEnergyTrend(logs);

      expect(trend).toEqual([
        { date: '2026-07-18', avgLevel: 6, count: 2 },
        { date: '2026-07-19', avgLevel: 6, count: 1 },
      ]);
    });

    it('sorts points ascending by date regardless of input order', () => {
      const logs: EnergyLog[] = [
        makeLog({ level: 5, loggedAt: localIso(2026, 7, 20) }),
        makeLog({ level: 5, loggedAt: localIso(2026, 7, 15) }),
      ];

      const trend = getEnergyTrend(logs);

      expect(trend.map((p) => p.date)).toEqual(['2026-07-15', '2026-07-20']);
    });

    it('rounds average level to one decimal place', () => {
      const logs: EnergyLog[] = [
        makeLog({ level: 3, loggedAt: localIso(2026, 7, 18) }),
        makeLog({ level: 4, loggedAt: localIso(2026, 7, 18) }),
        makeLog({ level: 4, loggedAt: localIso(2026, 7, 18) }),
      ];

      const trend = getEnergyTrend(logs);

      expect(trend[0].avgLevel).toBeCloseTo(3.7, 1);
    });
  });

  describe('getContextTagDistribution', () => {
    it('includes every known context tag even with zero logs', () => {
      const distribution = getContextTagDistribution([]);
      expect(distribution).toHaveLength(Object.keys(CONTEXT_TAG_DATA).length);
      expect(distribution.every((item) => item.count === 0 && item.avgLevel === 0)).toBe(true);
    });

    it('computes count, avgLevel and percentage per tag', () => {
      const logs: EnergyLog[] = [
        makeLog({ level: 6, contextTag: ContextTag.WORK }),
        makeLog({ level: 8, contextTag: ContextTag.WORK }),
        makeLog({ level: 4, contextTag: ContextTag.REST }),
      ];

      const distribution = getContextTagDistribution(logs);
      const work = distribution.find((item) => item.contextTag === ContextTag.WORK);
      const rest = distribution.find((item) => item.contextTag === ContextTag.REST);

      expect(work).toMatchObject({ count: 2, avgLevel: 7, percentage: 67 });
      expect(rest).toMatchObject({ count: 1, avgLevel: 4, percentage: 33 });
    });

    it('sorts descending by count', () => {
      const logs: EnergyLog[] = [
        makeLog({ contextTag: ContextTag.REST }),
        makeLog({ contextTag: ContextTag.WORK }),
        makeLog({ contextTag: ContextTag.WORK }),
      ];

      const distribution = getContextTagDistribution(logs);

      expect(distribution[0].contextTag).toBe(ContextTag.WORK);
      expect(distribution[0].count).toBe(2);
    });
  });

  describe('getAverageEnergyLevel', () => {
    it('returns 0 for no logs', () => {
      expect(getAverageEnergyLevel([])).toBe(0);
    });

    it('averages the level across all logs', () => {
      const logs: EnergyLog[] = [makeLog({ level: 2 }), makeLog({ level: 5 }), makeLog({ level: 8 })];
      expect(getAverageEnergyLevel(logs)).toBe(5);
    });
  });

  describe('getBestContextTag', () => {
    it('returns null when no tag has logs', () => {
      const distribution = getContextTagDistribution([]);
      expect(getBestContextTag(distribution)).toBeNull();
    });

    it('returns the tag with the highest avg level among logged tags', () => {
      const logs: EnergyLog[] = [
        makeLog({ level: 3, contextTag: ContextTag.WORK }),
        makeLog({ level: 9, contextTag: ContextTag.EXERCISE }),
      ];
      const distribution = getContextTagDistribution(logs);

      const best = getBestContextTag(distribution);

      expect(best?.contextTag).toBe(ContextTag.EXERCISE);
      expect(best?.avgLevel).toBe(9);
    });
  });
});
