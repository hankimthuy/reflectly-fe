import type { PaginatedResponse } from '../models/base';
import type { ApiEntry, CreateEntryRequest, Entry, UpdateEntryRequest } from '../models/entry';
import axiosInstance from './axiosSetup';

export const entriesService = {
  async getEntries(url?: string | null): Promise<PaginatedResponse<ApiEntry>> {
    let requestUrl = url || '/entries?page=0&size=5';

    if (requestUrl.startsWith('/api')) {
      requestUrl = requestUrl.substring(4);
    } // remove /api

    const { data } = await axiosInstance.get<PaginatedResponse<ApiEntry>>(requestUrl);
    return data;
  },

  async getEntry(id: string): Promise<Entry> {
    const { data } = await axiosInstance.get<Entry>(`/entries/${id}`);
    return data;
  },

  async createEntry(entry: CreateEntryRequest): Promise<Entry> {
    const { data } = await axiosInstance.post<Entry>('/entries', entry);
    return data;
  },

  async updateEntry(entry: UpdateEntryRequest): Promise<Entry> {
    const { id, ...updateData } = entry;
    const { data } = await axiosInstance.put<Entry>(`/entries/${id}`, updateData);
    return data;
  },

  async deleteEntry(id: string): Promise<void> {
    await axiosInstance.delete(`/entries/${id}`);
  },

  async getEntriesByDateRange(startDate: Date, endDate: Date): Promise<Entry[]> {
    const { data } = await axiosInstance.get<Entry[]>('/entries', {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
    return data;
  },

  async getEntriesByEmotion(emotion: string): Promise<Entry[]> {
    const { data } = await axiosInstance.get<Entry[]>('/entries', {
      params: { emotion }
    });
    return data;
  }
};