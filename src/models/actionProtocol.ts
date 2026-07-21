export const EffectivenessLevel = {
  WORKED: 'WORKED',
  PARTIAL: 'PARTIAL',
  DIDNT_WORK: 'DIDNT_WORK'
} as const;

export type EffectivenessLevel = typeof EffectivenessLevel[keyof typeof EffectivenessLevel];

export interface ActionProtocol {
  id: string;
  userId: string;
  title: string;
  trigger: string;
  script: string;
  usageCount: number;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateActionProtocolRequest {
  title: string;
  trigger: string;
  script: string;
}

export type UpdateActionProtocolRequest = CreateActionProtocolRequest;

export interface MarkProtocolUsedRequest {
  effectiveness: EffectivenessLevel;
  note?: string;
}
