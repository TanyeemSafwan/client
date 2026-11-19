import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder for list pages while URL state / data resolves. */
export function TablePageSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-8 w-28" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-28" />
      </div>
      <Skeleton className="h-[480px] rounded-xl" />
    </div>
  );
}
