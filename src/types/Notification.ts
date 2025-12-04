import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";

export interface UseDataInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export interface UseDataResponse {
  per_page: number;
  page: number;
  count: any;
  counts: any,
  results: Notification[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  status: string;
  createdAt: Date;
}