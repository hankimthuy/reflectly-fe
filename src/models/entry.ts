import { Emotion } from './emotion';

export interface Entry {
  id: string;
  userId: string;
  title: string;
  reflection: string;
  emotions: string[];
  templateKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEntryRequest {
  title: string;
  reflection: string;
  emotions: Emotion[];
  templateKey?: string;
}

export interface UpdateEntryRequest {
  id: string;
  title?: string;
  reflection?: string;
  emotions?: Emotion[];
  templateKey?: string;
}