"use client";

import { ChartColumn, Table2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { ErrorState } from "@/components/shared/error-state";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export type ChartTable = { columns: string[]; rows: ReactNode[][]; align?: ("left" | "right")[] };

type Props = {
  title: string;
  description?: ReactNode;
  /** Extra header controls (e.g. granularity toggle). */
  actions?: ReactNode;
  isLoading: boolean;
  isFetching?: boolean;
  error?: unknown;
  onRetry?: () => void;
  isEmpty?: boolean;
  emptyMessage?: string;
  /** Same data as a table: values never depend on color or hover alone. */
  table?: ChartTable;
  /** Height reserved for the chart (also used for skeleton / empty / error). */
  height?: number;
  className?: string;
  children: ReactNode;
};

/** Card frame for every dashboard chart: title, chart/table switch, loading/empty/error states. */
export function ChartCard({
  title,
  description,
  actions,
  isLoading,
  isFetching = false,
  error,
  onRetry,
  isEmpty = false,
  emptyMessage = "No data for this period.",
  table,
  height = 280,
  className,
  children,
}: Props) {
  const [view, setView] = useState<"chart" | "table">("chart");

  const body = () => {
    if (isLoading) return <Skeleton className="w-full rounded-lg" style={{ height }} />;
    if (error) {
      return (
        <div className="flex items-center justify-center" style={{ minHeight: height }}>
          <ErrorState message="Couldn't load this chart." onRetry={onRetry} />
        </div>
      );
    }
    if (isEmpty) {
      return (
        <div
          className="text-muted-foreground flex items-center justify-center text-sm"
          style={{ minHeight: height }}
        >
          {emptyMessage}
        </div>
      );
    }
    if (view === "table" && table) {
      return (
        <div className="overflow-auto rounded-lg border" style={{ maxHeight: height + 40 }}>
          <Table>
            <TableHeader className="bg-muted/40 sticky top-0">
              <TableRow>
                {table.columns.map((column, i) => (
                  <TableHead
                    key={column}
                    className={cn(table.align?.[i] === "right" && "text-right")}
                  >
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.rows.map((row, r) => (
                <TableRow key={r}>
                  {row.map((cell, c) => (
                    <TableCell
                      key={c}
                      className={cn("tabular-nums", table.align?.[c] === "right" && "text-right")}
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }
    return children;
  };

  return (
    <Card className={cn("gap-4", className)}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {(actions || table) && (
          <CardAction className="flex items-center gap-2">
            {actions}
            {table && (
              <ToggleGroup
                type="single"
                size="sm"
                variant="outline"
                spacing={0}
                value={view}
                onValueChange={(value) => value && setView(value as "chart" | "table")}
                aria-label={`${title} view`}
              >
                <ToggleGroupItem value="chart" aria-label="Chart view">
                  <ChartColumn />
                </ToggleGroupItem>
                <ToggleGroupItem value="table" aria-label="Table view">
                  <Table2 />
                </ToggleGroupItem>
              </ToggleGroup>
            )}
          </CardAction>
        )}
      </CardHeader>
      {/* Refetch keeps the frame: previous render stays, dimmed, instead of a skeleton flash. */}
      <CardContent className={cn("transition-opacity", isFetching && !isLoading && "opacity-60")}>
        {body()}
      </CardContent>
    </Card>
  );
}
