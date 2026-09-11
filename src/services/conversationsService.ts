import type { PaginatedResponse } from '../models/base';
import type { Conversation, SendMessageResponse } from '../models/conversation';
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

  /** Returns both the just-sent user message and Aura's reply, each already carrying its own
   * backend-scored moodEmotion/moodScore — see models/conversation.ts's SendMessageResponse. */
  async sendMessage(conversationId: string, content: string): Promise<SendMessageResponse> {
    const { data } = await axiosInstance.post<SendMessageResponse>(
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
