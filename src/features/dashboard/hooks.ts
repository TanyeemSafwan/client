"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import type { Granularity } from "@/types/dashboard";
import { dashboardApi } from "./api";
import type { DashboardRange } from "./search-params";

// Each widget has its own query so cards load (and fail) independently.
// keepPreviousData: on range change, charts hold their last render (dimmed) instead of flashing.
const shared = { placeholderData: keepPreviousData, staleTime: 60_000 } as const;

export function useDashboardSummary(range: DashboardRange) {
  return useQuery({
    queryKey: queryKeys.dashboard.summary(range),
    queryFn: ({ signal }) => dashboardApi.summary(range, signal),
    ...shared,
  });
}

export function useDashboardTrends(range: DashboardRange, granularity: Granularity | null) {
  return useQuery({
    queryKey: queryKeys.dashboard.trends({ ...range, granularity }),
    queryFn: ({ signal }) => dashboardApi.trends(range, granularity, signal),
    ...shared,
  });
}

export function useTopDoctors(range: DashboardRange) {
  return useQuery({
    queryKey: queryKeys.dashboard.patientsPerDoctor(range),
    queryFn: ({ signal }) => dashboardApi.patientsPerDoctor(range, signal),
    ...shared,
  });
}

export function useDashboardDistribution(range: DashboardRange) {
  return useQuery({
    queryKey: queryKeys.dashboard.distribution(range),
    queryFn: ({ signal }) => dashboardApi.distribution(range, signal),
    ...shared,
  });
}
