export type InsightCategory = 'VALUE' | 'BEHAVIOR_PATTERN' | 'RELATIONSHIP';

export interface Insight {
  id: string;
  insightText: string;
  category: InsightCategory;
  createdAt: string;
}
