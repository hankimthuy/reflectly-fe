import { Emotion } from '../models/emotion';
import type { Entry, CreateEntryRequest, UpdateEntryRequest, PaginatedResponse, ApiEntry } from '../models/entry';
import axiosInstance from './axiosSetup';

export const mapApiEntryToModel = (apiItem: ApiEntry): Entry => {  
  const dateObj = new Date(apiItem.createdAt);
  
  return {
    id: apiItem.id,
    userId: apiItem.userId,
    title: apiItem.title,
    reflection: apiItem.reflection,
    emotions: apiItem.emotions.filter((emotion: string): emotion is Emotion => {
      return Object.values(Emotion).includes(emotion as Emotion);
    }),    
    createdAt: dateObj,
    updatedAt: new Date(apiItem.updatedAt),
    dayDisplay: {
      month: dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
      date: dateObj.getDate().toString().padStart(2, '0'),
      dayName: dateObj.toLocaleString('en-US', { weekday: 'long' })
    }
  };
};

export const entriesService = {
  async getEntries(): Promise<PaginatedResponse<ApiEntry>> {
    const { data } = await axiosInstance.get<PaginatedResponse<ApiEntry>>('/entries');
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