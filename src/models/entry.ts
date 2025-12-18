import { Emotion } from './emotion';

export interface Entry {
  id: string;
  userId: string;
  title: string;
  reflection: string;
  emotions: Emotion[];
  createdAt: Date;
  updatedAt: Date;
  dayDisplay?: {
    dayName: string;
    month: string;
    date: string;
  };
}

export interface ApiEntry {
  id: string;
  userId: string;
  title: string;
  reflection: string;
  emotions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEntryRequest {
  title: string;
  reflection: string;
  emotions: Emotion[];
}

export interface UpdateEntryRequest {
  id: string;
  title?: string;
  reflection?: string;
  emotions?: Emotion[];
}

export interface PaginatedResponse<T> {
  content: T[];
  total: number;
  nextLink: string | null;
}