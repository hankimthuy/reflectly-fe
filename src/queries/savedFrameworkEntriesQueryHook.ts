import { useInfiniteQuery, useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import type {
  CreateSavedFrameworkEntryRequest,
  SavedFrameworkEntry,
  UpdateSavedFrameworkEntryRequest,
} from '../models/savedFrameworkEntry';
import type { PaginatedResponse } from '../models/base';
import { savedFrameworkEntriesService } from '../services/savedFrameworkEntriesService';

export const useSavedFrameworkEntriesInfiniteQuery = () => {
  return useInfiniteQuery<
    PaginatedResponse<SavedFrameworkEntry>,
    Error,
    InfiniteData<PaginatedResponse<SavedFrameworkEntry>>,
    string[],
    string | null
  >({
    queryKey: ['savedFrameworkEntries'],
    initialPageParam: null,
    staleTime: 1000 * 60 * 5,

    queryFn: async ({ pageParam }) => {
      const nextLink = pageParam as string | undefined;
      const response = await savedFrameworkEntriesService.getEntries(nextLink);
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

export const useCreateSavedFrameworkEntryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entry: CreateSavedFrameworkEntryRequest) => savedFrameworkEntriesService.createEntry(entry),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['savedFrameworkEntries'] });
    },
  });
};

export const useUpdateSavedFrameworkEntryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entry: UpdateSavedFrameworkEntryRequest) => savedFrameworkEntriesService.updateEntry(entry),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['savedFrameworkEntries'] });
    },
  });
};

export const useDeleteSavedFrameworkEntryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => savedFrameworkEntriesService.deleteEntry(id),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['savedFrameworkEntries'] });
    },
  });
};
