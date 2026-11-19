import { api } from "@/lib/api-client";
import type { User } from "@/types/api";

export type LoginInput = { email: string; password: string };

export const authApi = {
  login: (input: LoginInput) => api.post<{ data: User }>("/auth/login", input).then((r) => r.data),
  logout: () => api.post<void>("/auth/logout"),
  me: (signal?: AbortSignal) =>
    api.get<{ data: User }>("/auth/me", undefined, signal).then((r) => r.data),
};
