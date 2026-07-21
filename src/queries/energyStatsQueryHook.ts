import { useQuery } from '@tanstack/react-query';
import type { EnergyLog } from '../models/energyLog';
import { energyStatsService } from '../services/energyStatsService';

/**
 * Fetches energy logs for the last `days` days, used to power the
 * energy Dashboard (trend chart + categorical breakdowns).
 *
 * The query key is intentionally prefixed with 'energyLogs' so that the
 * QuickEnergyLog create mutation's refetchQueries({ queryKey: ['energyLogs'] })
 * automatically refreshes this data too.
 */
export const useEnergyStatsQuery = (days: number = 30) => {
  return useQuery<EnergyLog[]>({
    queryKey: ['energyLogs', 'stats', days],
    queryFn: () => energyStatsService.getEnergyRange(days),
    staleTime: 1000 * 60 * 5, // 5 mins cache
  });
};
