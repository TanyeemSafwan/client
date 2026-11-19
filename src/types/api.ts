/** Shapes shared with the Express API. */

export type Role = "admin" | "viewer";

export type Permission =
  "dashboard:read" | "doctor:read" | "doctor:write" | "patient:read" | "patient:write";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Paginated<T> = { data: T[]; meta: PaginationMeta };

export type ApiErrorBody = {
  error: { code: string; message: string; details?: Record<string, string[]> };
};
