import { Emotion } from './emotion';

export interface Entry {
  id: string;
  userId: string;
  title: string;
  reflection: string;
  emotions: Emotion[];
  activities?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEntryRequest {
  title: string;
  reflection: string;
  emotions: Emotion[];
  activities?: string[];
}

export interface UpdateEntryRequest {
  id: string;
  title?: string;
  reflection?: string;
  emotions?: Emotion[];
  activities?: string[];
}
