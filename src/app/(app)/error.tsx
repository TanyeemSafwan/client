"use client";

import { ErrorState } from "@/components/shared/error-state";

/** Catches render errors in any app page so the shell (sidebar, topbar) stays usable. */
export default function AppError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className="bg-card rounded-xl border">
      <ErrorState
        title="This page hit a problem"
        message="Something unexpected happened while rendering this page."
        onRetry={retry}
      />
    </div>
  );
}
