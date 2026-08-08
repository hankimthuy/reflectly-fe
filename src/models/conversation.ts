export type MessageRole = 'USER' | 'ASSISTANT';

export type ConversationStatus = 'ACTIVE' | 'ENDED' | 'EXTRACTING' | 'EXTRACTED' | 'EXTRACTION_FAILED';

export interface ConversationMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  status: ConversationStatus;
  startedAt: string;
  endedAt?: string;
  messages: ConversationMessage[];

  /** AI-generated markdown recap, present once the user has requested a summary at least once. */
  summary?: string;
}
