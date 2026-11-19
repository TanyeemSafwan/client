"use client";

import { parseAsStringLiteral, useQueryStates } from "nuqs";
import { dateRangeParsers } from "@/lib/search-params";

export const GRANULARITIES = ["day", "week", "month"] as const;

const dashboardSearchParams = {
  ...dateRangeParsers,
  // Unset → the server picks one from the range length.
  granularity: parseAsStringLiteral(GRANULARITIES),
};

/** Dashboard range lives in the URL; it scopes every widget so numbers always agree. */
export function useDashboardFilters() {
  const [filters, setFilters] = useQueryStates(dashboardSearchParams, { history: "push" });
  const range = { from: filters.from, to: filters.to };
  return { filters, range, setFilters, isDefaultRange: !filters.from && !filters.to };
}

export type DashboardRange = { from: Date | null; to: Date | null };
