import { useInfiniteQuery, useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import type {
  ActionProtocol,
  CreateActionProtocolRequest,
  MarkProtocolUsedRequest,
  UpdateActionProtocolRequest
} from "../models/actionProtocol";
import { actionProtocolService } from "../services/actionProtocolService";
import type { PaginatedResponse } from "../models/base";

const ACTION_PROTOCOLS_QUERY_KEY = ['actionProtocols'];

export const useActionProtocolsInfiniteQuery = () => {
  return useInfiniteQuery<
    PaginatedResponse<ActionProtocol>,
    Error,
    InfiniteData<PaginatedResponse<ActionProtocol>>,
    string[],
    string | null
  >({
    queryKey: ACTION_PROTOCOLS_QUERY_KEY,
    initialPageParam: null,
    staleTime: 1000 * 60 * 5, // 5 mins cache

    queryFn: async ({ pageParam }) => {
      const nextLink = pageParam as string | undefined;

      const response = await actionProtocolService.getActionProtocols(nextLink);

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

export const useCreateActionProtocolMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (protocol: CreateActionProtocolRequest) => actionProtocolService.createActionProtocol(protocol),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ACTION_PROTOCOLS_QUERY_KEY });
    }
  });
};

export const useUpdateActionProtocolMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, protocol }: { id: string; protocol: UpdateActionProtocolRequest }) =>
      actionProtocolService.updateActionProtocol(id, protocol),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ACTION_PROTOCOLS_QUERY_KEY });
    }
  });
};

export const useDeleteActionProtocolMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => actionProtocolService.deleteActionProtocol(id),
    retry: 3,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ACTION_PROTOCOLS_QUERY_KEY });
    },
  });
};

export const useMarkActionProtocolUsedMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: MarkProtocolUsedRequest }) =>
      actionProtocolService.markActionProtocolUsed(id, payload),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ACTION_PROTOCOLS_QUERY_KEY });
    }
  });
};
