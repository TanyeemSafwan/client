"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGE_SIZES } from "@/constants/domain";
import { formatNumber } from "@/lib/format";
import type { PaginationMeta } from "@/types/api";

export function DataTablePagination({
  meta,
  onPageChange,
  onLimitChange,
  noun = "results",
}: {
  meta: PaginationMeta | undefined;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: (typeof PAGE_SIZES)[number]) => void;
  noun?: string;
}) {
  if (!meta) return null;
  const { page, limit, total, totalPages } = meta;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
      <p className="text-muted-foreground text-sm" aria-live="polite">
        {total === 0
          ? `No ${noun}`
          : `Showing ${formatNumber(start)}–${formatNumber(end)} of ${formatNumber(total)} ${noun}`}
      </p>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-muted-foreground text-sm">Rows</span>
          <Select
            value={String(limit)}
            onValueChange={(value) => onLimitChange(Number(value) as (typeof PAGE_SIZES)[number])}
          >
            <SelectTrigger size="sm" className="w-18" aria-label="Rows per page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="text-sm font-medium tabular-nums">
          Page {page} of {totalPages}
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            className="hidden sm:inline-flex"
            onClick={() => onPageChange(1)}
            disabled={page <= 1}
            aria-label="First page"
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="hidden sm:inline-flex"
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
            aria-label="Last page"
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
