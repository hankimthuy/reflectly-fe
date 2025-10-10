// src/services/entry.service.ts
import { httpClient } from './httpClient.ts';
import type {AxiosResponse} from 'axios';

// TypeScript interfaces based on your database schema
export interface JournalEntry {
  entryId: string;
  entryDate: string;
  content: string;
  moodId: number;
}

// Data Transfer Object for creating or updating an entry
export type JournalEntryDto = Omit<JournalEntry, 'entryId'>;

const resource = '/entries';

export const EntryService = {
  getAll: (): Promise<AxiosResponse<JournalEntry[]>> => {
    return httpClient.get<JournalEntry[]>(resource);
  },

  getById: (id: string): Promise<AxiosResponse<JournalEntry>> => {
    return httpClient.getById<JournalEntry>(resource, id);
  },

  create: (data: JournalEntryDto): Promise<AxiosResponse<JournalEntry>> => {
    return httpClient.post<JournalEntry, JournalEntryDto>(resource, data);
  },

  update: (id: string, data: JournalEntryDto): Promise<AxiosResponse<JournalEntry>> => {
    return httpClient.put<JournalEntry, JournalEntryDto>(resource, id, data);
  },

  delete: (id: string): Promise<AxiosResponse<void>> => {
    return httpClient.delete(resource, id);
  },
};