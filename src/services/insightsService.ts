import type { PaginatedResponse } from '../models/base';
import type { Insight } from '../models/insight';
import axiosInstance from './axiosSetup';

export const insightsService = {
  async getInsights(url?: string | null): Promise<PaginatedResponse<Insight>> {
    const requestUrl = url || '/insights?page=0&size=10';
    const { data } = await axiosInstance.get<PaginatedResponse<Insight>>(requestUrl);
    return data;
  },

  async getInsightsForPerson(personId: string): Promise<PaginatedResponse<Insight>> {
    const { data } = await axiosInstance.get<PaginatedResponse<Insight>>('/insights', {
      params: { personId, page: 0, size: 20 },
    });
    return data;
  },
};
