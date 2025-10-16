import type { Entry, CreateEntryRequest, UpdateEntryRequest } from '../models/entry';
import { httpClient } from './httpClient';

export const entriesService = {
  // Get all entries for the current user
  async getEntries(): Promise<Entry[]> {
    try {
      const response = await httpClient.get<Entry[]>('/entries');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch entries:', error);
      throw error;
    }
  },

  // Get a specific entry by ID
  async getEntry(id: string): Promise<Entry> {
    try {
      const response = await httpClient.getById<Entry>('/entries', id);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch entry:', error);
      throw error;
    }
  },

  // Create a new entry
  async createEntry(entry: CreateEntryRequest): Promise<Entry> {
    try {
      const response = await httpClient.post<Entry, CreateEntryRequest>('/entries', entry);
      return response.data;
    } catch (error) {
      console.error('Failed to create entry:', error);
      throw error;
    }
  },

  // Update an existing entry
  async updateEntry(entry: UpdateEntryRequest): Promise<Entry> {
    try {
      const { id, ...updateData } = entry;
      const response = await httpClient.put<Entry, Omit<UpdateEntryRequest, 'id'>>('/entries', id, updateData);
      return response.data;
    } catch (error) {
      console.error('Failed to update entry:', error);
      throw error;
    }
  },

  // Delete an entry
  async deleteEntry(id: string): Promise<void> {
    try {
      await httpClient.delete('/entries', id);
    } catch (error) {
      console.error('Failed to delete entry:', error);
      throw error;
    }
  },

  // Get entries by date range
  async getEntriesByDateRange(startDate: Date, endDate: Date): Promise<Entry[]> {
    try {
      const response = await httpClient.get<Entry[]>('/entries', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch entries by date range:', error);
      throw error;
    }
  },

  // Get entries by emotion
  async getEntriesByEmotion(emotion: string): Promise<Entry[]> {
    try {
      const response = await httpClient.get<Entry[]>('/entries', { emotion });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch entries by emotion:', error);
      throw error;
    }
  }
};