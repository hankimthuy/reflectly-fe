import type { PaginatedResponse } from '../models/base';
import type { Conversation, ConversationMessage } from '../models/conversation';
import axiosInstance from './axiosSetup';

export const conversationsService = {
  async startConversation(): Promise<Conversation> {
    const { data } = await axiosInstance.post<Conversation>('/conversations');
    return data;
  },

  async getConversations(url?: string | null): Promise<PaginatedResponse<Conversation>> {
    const requestUrl = url || '/conversations?page=0&size=10';
    const { data } = await axiosInstance.get<PaginatedResponse<Conversation>>(requestUrl);
    return data;
  },

  async getConversation(id: string): Promise<Conversation> {
    const { data } = await axiosInstance.get<Conversation>(`/conversations/${id}`);
    return data;
  },

  async summarizeConversation(id: string): Promise<Conversation> {
    const { data } = await axiosInstance.post<Conversation>(`/conversations/${id}/summarize`);
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
