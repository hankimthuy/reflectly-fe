import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import type { PaginatedResponse } from '../models/base';
import type { Insight } from '../models/insight';
import { insightsService } from '../services/insightsService';

export const useInsightsInfiniteQuery = () => {
  return useInfiniteQuery<
    PaginatedResponse<Insight>,
    Error,
    InfiniteData<PaginatedResponse<Insight>>,
    string[],
    string | null
  >({
    queryKey: ['insights'],
    initialPageParam: null,
    staleTime: 1000 * 60,

    queryFn: async ({ pageParam }) => {
      const nextLink = pageParam as string | undefined;
      const response = await insightsService.getInsights(nextLink);
      return {
        ...response,
        content: response.content || [],
        nextLink: response.nextLink || null,
        total: response.total || 0,
      };
    },

    getNextPageParam: (lastPage) => lastPage.nextLink || undefined,
  });
};
