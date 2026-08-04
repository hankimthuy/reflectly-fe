import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { conversationsService } from '../services/conversationsService';

export const useConversationQuery = (id?: string) => {
  return useQuery({
    queryKey: ['conversations', id],
    queryFn: () => conversationsService.getConversation(id!),
    enabled: !!id,
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
      queryClient.invalidateQueries({ queryKey: ['people'] });
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
  });
};
