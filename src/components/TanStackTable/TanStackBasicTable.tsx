import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  // getFilteredRowModel,
  useReactTable
} from "@tanstack/react-table";

import { useEffect } from "react";
import TanStackBasicTablePaginationComponent from "./TanStackBasicTablePaginationComponent";
import TanStackBasicTableSortingComponent from "./TanStackBasicTableSortingComponent";
import TanStackBasicTableFilterComponent from "./TanStackBasicTableFilterComponent";
import TanStackBasicTableTableComponent from "./TanStackBasicTableTableComponent";
import TanStackBasicTablePaginationNavigationComponent from "./TanStackBasicTablePaginationNavigationComponent";
import { TableProps } from "@/types/Table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Filter, Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";
import { Button } from "../ui/button";

export default function TanStackBasicTable<TData, TValue>({
  isTableDataLoading,
  paginatedTableData,
  columns,
  pagination = {
    pageIndex: 0,
    pageSize: 2
  },
  sorting = [],
  setSorting,
  setPagination,
  details,
  columnFilters = [],
  setColumnFilters,
  hideFilter,
  cursorPointer
}: TableProps<TData, TValue>) {
const table = useReactTable({
  data: paginatedTableData?.results || paginatedTableData?.result || [],
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),

  // sorting
  onSortingChange: setSorting,
  sortDescFirst: true,

  // filter config
  onColumnFiltersChange: setColumnFilters,
  manualFiltering: true,

  // pagination: enable built-in client-side pagination
  getPaginationRowModel: getPaginationRowModel(),
  // keep this so parent can still track pagination state if you want
  onPaginationChange: setPagination,
  // IMPORTANT: turn off manualPagination to allow client-side pagination
  manualPagination: false,

  state: {
    sorting,
    pagination,
    columnFilters
  }
});


  

  // to reset page index to first page
  useEffect(() => {
    if (setPagination) {
      setPagination((pagination) => ({
        pageIndex: 0,
        pageSize: pagination.pageSize
      }));
    }
  }, [columnFilters, setPagination]);

  const shimmer = [...Array(10)];


  return (
    <div className="px-0">
     {!hideFilter &&  <TanStackBasicTableFilterComponent
        table={table}
        setColumnFilters={setColumnFilters}
      />}

      {isTableDataLoading ? (
        <div className="flex flex-col space-y-3 border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((header) => (
                <TableRow key={header.id}>
                  <TableHead>S.N.</TableHead>
                  {header.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div className="hover:cursor-pointer">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {(header.column.getIsSorted() === "asc" ||
                            header.column.getIsSorted() === "desc") && (
                            <span>
                              {header.column.getIsSorted() === "asc" && "↑"}
                              {header.column.getIsSorted() === "desc" && "↓"}
                            </span>
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {shimmer.map((index, i) => (
                <TableRow key={i}>
                  {table.getFlatHeaders().map((i: any) => (
                    <TableCell key={i.id}>
                      <Skeleton className="h-4 w-[50px]" />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Skeleton className="h-4 w-[50px]" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <>
          <div className="">
            <div className="mb-8">
              <TanStackBasicTableTableComponent table={table} details={details} cursorPointer={cursorPointer} />
            </div>
            {(paginatedTableData?.counts > 10 ||
              paginatedTableData?.count > 10) && (
              <TanStackBasicTablePaginationComponent table={table} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
