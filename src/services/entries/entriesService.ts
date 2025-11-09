import type { Entry, CreateEntryRequest, UpdateEntryRequest } from '../../models/entry';
import { httpClient } from '../core/httpClient';

export const entriesService = {
  // Get all entries for the current user
  async getEntries(): Promise<Entry[]> {
    const response = await httpClient.get<Entry[]>('/entries');
    return response.data;
  },

  // Get a specific entry by ID
  async getEntry(id: string): Promise<Entry> {
    const response = await httpClient.getById<Entry>('/entries', id);
    return response.data;
  },

  // Create a new entry
  async createEntry(entry: CreateEntryRequest): Promise<Entry> {
    const response = await httpClient.post<Entry, CreateEntryRequest>('/entries', entry);
    return response.data;
  },

  // Update an existing entry
  async updateEntry(entry: UpdateEntryRequest): Promise<Entry> {
    const { id, ...updateData } = entry;
    const response = await httpClient.put<Entry, Omit<UpdateEntryRequest, 'id'>>('/entries', id, updateData);
    return response.data;
  },

  // Delete an entry
  async deleteEntry(id: string): Promise<void> {
    await httpClient.delete('/entries', id);
  },

  // Get entries by date range
  async getEntriesByDateRange(startDate: Date, endDate: Date): Promise<Entry[]> {
    const response = await httpClient.get<Entry[]>('/entries', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
    return response.data;
  },

  // Get entries by emotion
  async getEntriesByEmotion(emotion: string): Promise<Entry[]> {
    const response = await httpClient.get<Entry[]>('/entries', { emotion });
    return response.data;
  }
};