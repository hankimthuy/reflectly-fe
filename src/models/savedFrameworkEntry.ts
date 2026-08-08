/**
 * A user-authored, editable structured entry captured from (or inspired by) an Aura chat —
 * shown and editable on "Đúc kết". Deliberately separate from `Insight` (models/insight.ts,
 * if present) — that's the AI auto-extracted, read-only timeline shown on "Thấu hiểu". This is
 * the opposite: user-owned and editable.
 *
 * Only FREEFORM and JOHARI_WINDOW are reachable via the UI today — the rest are reserved for a
 * later phase (see plan doc) so adding them won't require touching the type shape below.
 */
export type FrameworkType = 'FREEFORM' | 'JOHARI_WINDOW' | 'ACT_MATRIX' | 'PERSONAL_SWOT' | 'LIFE_POSITIONS';

export interface FreeformPayload {
  content: string;
  tags?: string[];
}

export interface JohariWindowPayload {
  open: string;
  blind: string;
  hidden: string;
  unknown: string;
}

export interface ActMatrixPayload {
  fiveSenses: string;
  values: string;
  awayMoves: string;
  towardMoves: string;
}

export interface PersonalSwotPayload {
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
}

/** Transactional-analysis "OK Corral" positions — always about one specific relationship. */
export type LifePosition = 'I_OK_YOU_OK' | 'I_OK_YOU_NOT_OK' | 'I_NOT_OK_YOU_OK' | 'I_NOT_OK_YOU_NOT_OK';

export interface LifePositionsPayload {
  position: LifePosition;
  notes?: string;
}

export interface SavedFrameworkEntry {
  id: string;
  frameworkType: FrameworkType;
  title?: string;
  payload: Record<string, unknown>;
  conversationId?: string;
  /** Which person (relationship map) this entry is about — set for LIFE_POSITIONS. */
  personId?: string;
  personName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavedFrameworkEntryRequest {
  frameworkType: FrameworkType;
  title?: string;
  payload: Record<string, unknown>;
  conversationId?: string;
  personId?: string;
}

export interface UpdateSavedFrameworkEntryRequest {
  id: string;
  title?: string;
  payload: Record<string, unknown>;
  personId?: string;
}
