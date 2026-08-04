export type RelationshipType = 'FAMILY' | 'FRIEND' | 'PARTNER' | 'COLLEAGUE' | 'MANAGER' | 'OTHER';

export interface Person {
  id: string;
  name: string;
  relationshipType: RelationshipType;
  notes?: string | null;
  lastMentionedAt?: string | null;
  daysSinceLastMention?: number | null;
  /** 0.0 (needs attention) to 1.0 (healthy). */
  healthSignal: number;
  nudgeText?: string | null;
}

export interface CreatePersonRequest {
  name: string;
  relationshipType: RelationshipType;
  notes?: string;
}
