"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

/** Row of search + filters with a "Reset" button when any filter is active. */
export function DataTableToolbar({
  children,
  isFiltered,
  onReset,
}: {
  children: ReactNode;
  isFiltered: boolean;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      {children}
      {isFiltered && (
        <Button variant="ghost" onClick={onReset} className="self-start sm:self-auto">
          Reset
          <X />
        </Button>
      )}
    </div>
  );
}
