import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

export interface UseUsersInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export interface UseUsersResponse {
  per_page: number;
  page: number;
  count: any;
  counts: any,
  results: User[];
}

export interface User {
  placeId: any;
  id: string;
  publicId: string;
  name: string;
  email: string;
  status: string;
  image: string;
  createdAt: string;
}