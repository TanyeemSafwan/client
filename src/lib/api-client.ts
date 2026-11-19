import { format } from "date-fns";
import type { ApiErrorBody } from "@/types/api";

const BASE_URL = "/api/v1"; // same origin; next.config rewrites to Express

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type QueryValue = string | number | boolean | Date | null | undefined | Array<string | number>;
export type QueryParams = Record<string, QueryValue>;

/** Skips empty values; arrays become comma lists (`?status=a,b`), dates become YYYY-MM-DD. */
export function toSearchParams(params: QueryParams = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      if (value.length) search.set(key, value.join(","));
    } else if (value instanceof Date) {
      // Local calendar date (toISOString would shift it to UTC, e.g. the previous day in UTC+6).
      search.set(key, format(value, "yyyy-MM-dd"));
    } else {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

/** Session expired mid-use: go to login and come back here afterwards. */
function redirectToLogin() {
  if (typeof window === "undefined" || window.location.pathname === "/login") return;
  const next = window.location.pathname + window.location.search;
  // Full reload on purpose: wipes all in-memory state (query cache) from the expired session.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign(`/login?next=${encodeURIComponent(next)}`);
}

async function request<T>(
  method: string,
  path: string,
  options: { params?: QueryParams; body?: unknown; signal?: AbortSignal } = {},
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}${toSearchParams(options.params)}`, {
    method,
    credentials: "same-origin",
    headers: options.body === undefined ? undefined : { "Content-Type": "application/json" },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: options.signal,
  });

  if (response.status === 204) return undefined as T;

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const error = (payload as ApiErrorBody | null)?.error;
    if (response.status === 401 && path !== "/auth/login") redirectToLogin();
    throw new ApiError(
      response.status,
      error?.code ?? "NETWORK_ERROR",
      error?.message ?? "Something went wrong. Please try again.",
      error?.details,
    );
  }

  return payload as T;
}

export const api = {
  get: <T>(path: string, params?: QueryParams, signal?: AbortSignal) =>
    request<T>("GET", path, { params, signal }),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, { body }),
  patch: <T>(path: string, body: unknown) => request<T>("PATCH", path, { body }),
  delete: (path: string) => request<void>("DELETE", path),
};
