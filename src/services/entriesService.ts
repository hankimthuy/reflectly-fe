import type { Entry, CreateEntryRequest, UpdateEntryRequest } from '../models/entry';
import axiosInstance from './axiosSetup';

export const entriesService = {
  async getEntries(): Promise<Entry[]> {
    const { data } = await axiosInstance.get<Entry[]>('/entries');
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