import type { Emotion } from './emotion';

export type MessageRole = 'USER' | 'ASSISTANT';

export type ConversationStatus = 'ACTIVE' | 'ENDED' | 'EXTRACTING' | 'EXTRACTED' | 'EXTRACTION_FAILED';

export interface ConversationMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  /** Backend-scored mood for this message, null until scoring lands (or for messages scored
   * before this field existed). Matches the Emotion catalog in models/emotion.ts exactly. */
  moodEmotion?: Emotion | null;
  /** 0 (lightest) – 1 (heaviest), paired with moodEmotion. */
  moodScore?: number | null;
}

/** The response shape of POST /conversations/{id}/messages as of the mood-scoring rollout —
 * both the just-sent user message and Aura's reply come back together, each already carrying
 * its own mood read, instead of the old bare-assistant-message response. */
export interface SendMessageResponse {
  userMessage: ConversationMessage;
  assistantMessage: ConversationMessage;
}

export interface Conversation {
  id: string;
  status: ConversationStatus;
  startedAt: string;
  endedAt?: string;
  messages: ConversationMessage[];

  /** AI-generated markdown recap, present once the user has requested a summary at least once. */
  summary?: string;

  /** Mood at the start/end of the session — null until the conversation has ended and at least
   * one message in it was scored. */
  initialMoodEmotion?: Emotion | null;
  initialMoodScore?: number | null;
  finalMoodEmotion?: Emotion | null;
  finalMoodScore?: number | null;
}
