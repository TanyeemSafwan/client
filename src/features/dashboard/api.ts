import { api } from "@/lib/api-client";
import type {
  DashboardDistribution,
  DashboardSummary,
  DashboardTrends,
  Granularity,
  TopDoctor,
} from "@/types/dashboard";
import type { DashboardRange } from "./search-params";

const unwrap = <T>(response: { data: T }) => response.data;

export const dashboardApi = {
  summary: (range: DashboardRange, signal?: AbortSignal) =>
    api.get<{ data: DashboardSummary }>("/dashboard/summary", range, signal).then(unwrap),

  trends: (range: DashboardRange, granularity: Granularity | null, signal?: AbortSignal) =>
    api
      .get<{ data: DashboardTrends }>("/dashboard/trends", { ...range, granularity }, signal)
      .then(unwrap),

  patientsPerDoctor: (range: DashboardRange, signal?: AbortSignal) =>
    api
      .get<{ data: TopDoctor[] }>("/dashboard/patients-per-doctor", { ...range, limit: 10 }, signal)
      .then(unwrap),

  distribution: (range: DashboardRange, signal?: AbortSignal) =>
    api.get<{ data: DashboardDistribution }>("/dashboard/distribution", range, signal).then(unwrap),
};
