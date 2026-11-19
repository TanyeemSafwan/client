"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { queryKeys } from "@/lib/query-keys";
import type { Permission } from "@/types/api";
import { authApi } from "./api";

/** The signed-in user. Cached for the session; refetched only after login/logout. */
export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: ({ signal }) => authApi.me(signal),
    staleTime: Infinity,
  });
}

/** UI-only permission check. The API enforces permissions regardless. */
export function useCan(permission: Permission) {
  const { data: user } = useMe();
  return user?.permissions.includes(permission) ?? false;
}

/** Only allows same-site relative paths, so `?next=` can't redirect to another site. */
function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

export function useLogin(next: string | null) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.me, user);
      router.replace(safeNext(next));
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      queryClient.clear(); // drop every cached response from this session
      router.replace("/login");
    },
  });
}
