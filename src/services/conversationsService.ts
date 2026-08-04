import type { Conversation, ConversationMessage } from '../models/conversation';
import axiosInstance from './axiosSetup';

export const conversationsService = {
  async startConversation(): Promise<Conversation> {
    const { data } = await axiosInstance.post<Conversation>('/conversations');
    return data;
  },

  async getConversation(id: string): Promise<Conversation> {
    const { data } = await axiosInstance.get<Conversation>(`/conversations/${id}`);
    return data;
  },

  async sendMessage(conversationId: string, content: string): Promise<ConversationMessage> {
    const { data } = await axiosInstance.post<ConversationMessage>(
      `/conversations/${conversationId}/messages`,
      { content },
    );
    return data;
  },

  async endConversation(id: string): Promise<Conversation> {
    const { data } = await axiosInstance.post<Conversation>(`/conversations/${id}/end`);
    return data;
  },
};
