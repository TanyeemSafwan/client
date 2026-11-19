import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./api-client";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        // Retry once on network/5xx errors; 4xx won't fix themselves.
        retry: (failureCount, error) =>
          !(error instanceof ApiError && error.status < 500) && failureCount < 1,
      },
      mutations: { retry: false },
    },
  });
}
