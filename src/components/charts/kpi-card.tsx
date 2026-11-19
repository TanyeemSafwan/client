import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompact } from "@/lib/format";

/**
 * Stat tile: label · value · optional delta vs the previous period.
 * The delta uses neutral ink + an arrow: "more new patients" isn't inherently good or bad,
 * so it doesn't borrow success/danger colors.
 */
export function KpiCard({
  label,
  value,
  icon: Icon,
  changePct,
  footnote,
  isLoading,
}: {
  label: string;
  value: number | undefined;
  icon: LucideIcon;
  /** % change vs previous period; null = no previous data ("new"). */
  changePct?: number | null;
  footnote?: ReactNode;
  isLoading: boolean;
}) {
  const DeltaIcon =
    changePct === undefined || changePct === null || changePct === 0
      ? Minus
      : changePct > 0
        ? ArrowUpRight
        : ArrowDownRight;

  return (
    <Card className="gap-3 p-5">
      <div className="text-muted-foreground flex items-center justify-between text-sm">
        <span>{label}</span>
        <Icon className="size-4" aria-hidden />
      </div>
      {isLoading || value === undefined ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <p className="text-3xl font-semibold tracking-tight">{formatCompact(value)}</p>
      )}
      <div className="text-muted-foreground flex min-h-5 items-center gap-1 text-xs">
        {changePct !== undefined && !isLoading && (
          <span className="text-foreground inline-flex items-center gap-0.5 font-medium">
            <DeltaIcon className="size-3.5" aria-hidden />
            {changePct === null ? "New" : `${Math.abs(changePct)}%`}
            <span className="sr-only">
              {changePct === null ? "" : changePct >= 0 ? " increase" : " decrease"}
            </span>
          </span>
        )}
        {footnote}
      </div>
    </Card>
  );
}
