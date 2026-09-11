import { useQuery } from '@tanstack/react-query';
import { getMoodSummary, getUserStats } from '../services/userService';

/** The viewer's own IANA zone, so "last 7 days"/"last 90 days" line up with their calendar
 * rather than UTC's. */
const browserTz = (): string => {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
        return 'UTC';
    }
};

export const useMoodSummaryQuery = (days = 7) => {
    return useQuery({
        queryKey: ['userMoodSummary', days],
        queryFn: () => getMoodSummary(days, browserTz()),
        staleTime: 1000 * 60 * 5,
    });
};

export const useUserStatsQuery = (days = 90) => {
    return useQuery({
        queryKey: ['userStats', days],
        queryFn: () => getUserStats(days, browserTz()),
        staleTime: 1000 * 60 * 5,
    });
};
