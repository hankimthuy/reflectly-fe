import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import type { CreateEntryRequest, Entry, UpdateEntryRequest } from "../models/entry";
import { entriesService } from "../services/entriesService";
import type { PaginatedResponse } from "../models/base";

export const useEntriesInfiniteQuery = () => {
  return useInfiniteQuery<
    PaginatedResponse<Entry>, 
    Error, 
    InfiniteData<PaginatedResponse<Entry>>, 
    string[],
    string | null
  >({
    queryKey: ['entries'],
    initialPageParam: null,
    staleTime: 1000 * 60 * 5, // 5 mins cache
    
    queryFn: async ({ pageParam }) => {
      const nextLink = pageParam as string | undefined;
      
      const response = await entriesService.getEntries(nextLink);
      
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

export const useEntryQuery = (id: string) => {
  return useQuery({
    queryKey: ['entries', id],
    queryFn: () => entriesService.getEntry(id),
    staleTime: 1000 * 60 * 5, // 5 mins cache
    enabled: !!id
  });
};

export const useCreateEntryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entry: CreateEntryRequest) => entriesService.createEntry(entry),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['entries'] });
    }
  });
};

export const useUpdateEntryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entry: UpdateEntryRequest) => entriesService.updateEntry(entry),
    retry: 3,
    onSuccess: (data) => {
      queryClient.refetchQueries({ queryKey: ['entries'] });
      queryClient.refetchQueries({ queryKey: ['entries', data.id] });
    },
  });
};

export const useDeleteEntryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => entriesService.deleteEntry(id),
    retry: 3,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['entries'] });
    },
  });
};


