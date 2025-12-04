import {
    ColumnFiltersState,
    PaginationState,
    SortingState,
  } from "@tanstack/react-table";
  
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
    results: Interest[];
  }
  
  export interface Interest {
    id: string;
    name: string;
    image:string
    createdAt: string;
    status: string;
  }