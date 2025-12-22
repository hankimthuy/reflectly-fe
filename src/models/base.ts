export interface PaginatedResponse<T> {
  content: T[];
  total: number;
  nextLink: string | null;
}