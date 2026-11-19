/**
 * Central query-key factory. Keys are hierarchical so one call can invalidate a whole group,
 * e.g. `queryClient.invalidateQueries({ queryKey: queryKeys.patients.all })`.
 */
export const queryKeys = {
  me: ["auth", "me"] as const,
  doctors: {
    all: ["doctors"] as const,
    list: (filters: object) => ["doctors", "list", filters] as const,
    detail: (id: string) => ["doctors", "detail", id] as const,
    options: (search: string) => ["doctors", "options", search] as const,
    filters: ["doctors", "filters"] as const,
  },
  patients: {
    all: ["patients"] as const,
    list: (filters: object) => ["patients", "list", filters] as const,
    detail: (id: string) => ["patients", "detail", id] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
    summary: (range: object) => ["dashboard", "summary", range] as const,
    trends: (params: object) => ["dashboard", "trends", params] as const,
    patientsPerDoctor: (params: object) => ["dashboard", "patients-per-doctor", params] as const,
    distribution: (range: object) => ["dashboard", "distribution", range] as const,
  },
};
