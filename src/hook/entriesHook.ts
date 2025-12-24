import { useInfiniteQuery, useQuery, type InfiniteData } from "@tanstack/react-query";
import type { PaginatedResponse, Entry } from "../models/entry";
import { entriesService, mapApiEntryToModel } from "../services/entriesService";

export const useEntriesQuery = useQuery({
    queryKey: ['entries'],
    // initialPageParam: null,
    queryFn: async ({ pageParam: nextLink }) => {
      const response = await entriesService.getEntries(nextLink as string | undefined);
      return {
        ...response,
        content: response.content?.map(mapApiEntryToModel) || [],
        nextLink: response.nextLink || null,
        total: response.total || 0
      };
    },
    // getNextPageParam: (lastPage) => {
    //   return lastPage.nextLink || undefined;
    // },
  });