"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type Updater,
} from "@tanstack/react-table";
import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type DataTableProps<TData> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TanStack's own ColumnDef default
  columns: ColumnDef<TData, any>[];
  data: TData[] | undefined;
  getRowId: (row: TData) => string;
  /** First load: show skeleton rows. */
  isLoading: boolean;
  /** Background refetch (e.g. next page): keep old rows, dim them slightly. */
  isFetching?: boolean;
  skeletonRows?: number;
  /** Server-side sorting (one column at a time). */
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  /** Rendered instead of rows when there's no data. */
  emptyState: ReactNode;
  /** Below `md`, rows render as cards instead of a table. */
  renderMobileCard?: (row: TData) => ReactNode;
};

/**
 * Generic table for paginated server data. Pagination, filtering and sorting happen on the
 * server; this component only renders the current page.
 */
export function DataTable<TData>({
  columns,
  data,
  getRowId,
  isLoading,
  isFetching = false,
  skeletonRows = 8,
  sorting = [],
  onSortingChange,
  emptyState,
  renderMobileCard,
}: DataTableProps<TData>) {
  // TanStack Table returns functions React Compiler can't memoize; the compiler skips this
  // component automatically (known, documented incompatibility), so the warning is expected.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data ?? [],
    columns,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    enableMultiSort: false,
    enableSortingRemoval: false,
    state: { sorting },
    onSortingChange: (updater: Updater<SortingState>) => {
      onSortingChange?.(typeof updater === "function" ? updater(sorting) : updater);
    },
  });

  const rows = table.getRowModel().rows;
  const isEmpty = !isLoading && rows.length === 0;

  return (
    <div
      className={cn("transition-opacity", isFetching && !isLoading && "opacity-60")}
      aria-busy={isLoading || isFetching}
    >
      {/* Desktop / tablet */}
      <div
        className={cn(
          "bg-card overflow-hidden rounded-xl border",
          renderMobileCard && "hidden md:block",
        )}
      >
        <Table>
          <TableHeader className="bg-muted/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-11 px-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: skeletonRows }, (_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  {columns.map((_, j) => (
                    <TableCell key={j} className="px-4 py-3">
                      <Skeleton className="h-5 w-full max-w-40" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {isEmpty && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length}>{emptyState}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile */}
      {renderMobileCard && (
        <div className="space-y-3 md:hidden">
          {isLoading &&
            Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
          {rows.map((row) => (
            <div key={row.id}>{renderMobileCard(row.original)}</div>
          ))}
          {isEmpty && <div className="bg-card rounded-xl border">{emptyState}</div>}
        </div>
      )}
    </div>
  );
}
