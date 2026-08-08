import type { PaginatedResponse } from '../models/base';
import type {
  CreateSavedFrameworkEntryRequest,
  SavedFrameworkEntry,
  UpdateSavedFrameworkEntryRequest,
} from '../models/savedFrameworkEntry';
import axiosInstance from './axiosSetup';

export const savedFrameworkEntriesService = {
  async getEntries(url?: string | null): Promise<PaginatedResponse<SavedFrameworkEntry>> {
    const requestUrl = url || '/saved-framework-entries?page=0&size=10';
    const { data } = await axiosInstance.get<PaginatedResponse<SavedFrameworkEntry>>(requestUrl);
    return data;
  },

  async getEntry(id: string): Promise<SavedFrameworkEntry> {
    const { data } = await axiosInstance.get<SavedFrameworkEntry>(`/saved-framework-entries/${id}`);
    return data;
  },

  async createEntry(entry: CreateSavedFrameworkEntryRequest): Promise<SavedFrameworkEntry> {
    const { data } = await axiosInstance.post<SavedFrameworkEntry>('/saved-framework-entries', entry);
    return data;
  },

  async updateEntry(entry: UpdateSavedFrameworkEntryRequest): Promise<SavedFrameworkEntry> {
    const { id, ...updateData } = entry;
    const { data } = await axiosInstance.put<SavedFrameworkEntry>(`/saved-framework-entries/${id}`, updateData);
    return data;
  },

  async deleteEntry(id: string): Promise<void> {
    await axiosInstance.delete(`/saved-framework-entries/${id}`);
  },
};
