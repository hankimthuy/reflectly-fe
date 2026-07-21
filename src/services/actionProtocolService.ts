import type { PaginatedResponse } from '../models/base';
import type {
  ActionProtocol,
  CreateActionProtocolRequest,
  MarkProtocolUsedRequest,
  UpdateActionProtocolRequest
} from '../models/actionProtocol';
import axiosInstance from './axiosSetup';

export const actionProtocolService = {
  async getActionProtocols(url?: string | null): Promise<PaginatedResponse<ActionProtocol>> {
    const requestUrl = url || '/protocols?page=0&size=10';

    const { data } = await axiosInstance.get<PaginatedResponse<ActionProtocol>>(requestUrl);
    return data;
  },

  async getActionProtocol(id: string): Promise<ActionProtocol> {
    const { data } = await axiosInstance.get<ActionProtocol>(`/protocols/${id}`);
    return data;
  },

  async createActionProtocol(protocol: CreateActionProtocolRequest): Promise<ActionProtocol> {
    const { data } = await axiosInstance.post<ActionProtocol>('/protocols', protocol);
    return data;
  },

  async updateActionProtocol(id: string, protocol: UpdateActionProtocolRequest): Promise<ActionProtocol> {
    const { data } = await axiosInstance.put<ActionProtocol>(`/protocols/${id}`, protocol);
    return data;
  },

  async deleteActionProtocol(id: string): Promise<void> {
    await axiosInstance.delete(`/protocols/${id}`);
  },

  async markActionProtocolUsed(id: string, payload: MarkProtocolUsedRequest): Promise<ActionProtocol> {
    const { data } = await axiosInstance.post<ActionProtocol>(`/protocols/${id}/use`, payload);
    return data;
  }
};
