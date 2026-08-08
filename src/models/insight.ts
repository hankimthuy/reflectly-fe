export type InsightCategory = 'VALUE' | 'BEHAVIOR_PATTERN' | 'RELATIONSHIP';

export interface Insight {
  id: string;
  insightText: string;
  category: InsightCategory;
  createdAt: string;
  /** Which person (relationship map) this insight is about, if the extraction could tell. */
  personId?: string;
  personName?: string;
}
