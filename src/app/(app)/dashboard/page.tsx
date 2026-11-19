import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardView } from "@/features/dashboard/dashboard-view";

export const metadata: Metadata = { title: "Dashboard" };

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-8 w-40" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[360px] rounded-xl" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    // The dashboard reads its date range from the URL (nuqs), which needs a Suspense boundary.
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardView />
    </Suspense>
  );
}
