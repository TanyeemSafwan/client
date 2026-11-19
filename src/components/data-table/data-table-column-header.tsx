"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Header label that toggles server-side sorting when the column is sortable. */
export function DataTableColumnHeader<TData>({
  column,
  title,
  className,
}: {
  column: Column<TData>;
  title: string;
  className?: string;
}) {
  if (!column.getCanSort()) {
    return <span className={className}>{title}</span>;
  }

  const sorted = column.getIsSorted();
  const Icon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ChevronsUpDown;

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("data-[sorted=true]:text-foreground -ml-2 h-8 px-2", className)}
      data-sorted={!!sorted}
      onClick={() => column.toggleSorting(sorted === "asc")}
      aria-label={`Sort by ${title}${sorted ? `, currently ${sorted === "asc" ? "ascending" : "descending"}` : ""}`}
    >
      {title}
      <Icon className={cn("size-3.5", !sorted && "opacity-50")} />
    </Button>
  );
}
