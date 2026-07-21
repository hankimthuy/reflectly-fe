import { useInfiniteQuery, useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import type { CreateEnergyLogRequest, EnergyLog } from "../models/energyLog";
import { energyLogService } from "../services/energyLogService";
import type { PaginatedResponse } from "../models/base";

export const useEnergyLogsInfiniteQuery = () => {
  return useInfiniteQuery<
    PaginatedResponse<EnergyLog>,
    Error,
    InfiniteData<PaginatedResponse<EnergyLog>>,
    string[],
    string | null
  >({
    queryKey: ['energyLogs'],
    initialPageParam: null,
    staleTime: 1000 * 60 * 5, // 5 mins cache

    queryFn: async ({ pageParam }) => {
      const nextLink = pageParam as string | undefined;

      const response = await energyLogService.getEnergyLogs(nextLink);

      return {
        ...response,
        content: response.content || [],
        nextLink: response.nextLink || null,
        total: response.total || 0
      };
    },

    getNextPageParam: (lastPage) => {
      return lastPage.nextLink || undefined;
    },
  });
};

export const useCreateEnergyLogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (log: CreateEnergyLogRequest) => energyLogService.createEnergyLog(log),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['energyLogs'] });
    }
  });
};

export const useDeleteEnergyLogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => energyLogService.deleteEnergyLog(id),
    retry: 3,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['energyLogs'] });
    },
  });
};
