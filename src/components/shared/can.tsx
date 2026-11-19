"use client";

import type { ReactNode } from "react";
import { useCan } from "@/features/auth/hooks";
import type { Permission } from "@/types/api";

/** Renders children only if the signed-in user has `perm` (e.g. hides write actions for viewers). */
export function Can({
  perm,
  children,
  fallback = null,
}: {
  perm: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return useCan(perm) ? children : fallback;
}
