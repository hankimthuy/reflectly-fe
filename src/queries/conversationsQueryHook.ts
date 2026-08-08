import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import type { PaginatedResponse } from '../models/base';
import type { Conversation } from '../models/conversation';
import { conversationsService } from '../services/conversationsService';

export const useConversationQuery = (id?: string) => {
  return useQuery({
    queryKey: ['conversations', id],
    queryFn: () => conversationsService.getConversation(id!),
    enabled: !!id,
  });
};

export const useConversationsInfiniteQuery = () => {
  return useInfiniteQuery<
    PaginatedResponse<Conversation>,
    Error,
    InfiniteData<PaginatedResponse<Conversation>>,
    string[],
    string | null
  >({
    queryKey: ['conversations', 'list'],
    initialPageParam: null,
    staleTime: 1000 * 60 * 5,

    queryFn: async ({ pageParam }) => {
      const nextLink = pageParam as string | undefined;
      const response = await conversationsService.getConversations(nextLink);
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

export const useStartConversationMutation = () => {
  return useMutation({
    mutationFn: () => conversationsService.startConversation(),
  });
};

export const useSendMessageMutation = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => conversationsService.sendMessage(conversationId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', conversationId] });
    },
  });
};

export const useEndConversationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => conversationsService.endConversation(conversationId),
    onSuccess: (_data, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ['conversations', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['people'] });
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
  });
};

export const useSummarizeConversationMutation = () => {
  return useMutation({
    mutationFn: (conversationId: string) => conversationsService.summarizeConversation(conversationId),
  });
};
