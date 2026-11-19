"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatNumber } from "@/lib/format";

export type Segment = { key: string; label: string; value: number; color: string };

/**
 * 100% stacked bar for a small part-to-whole (<= 4 parts). 2px surface gaps between segments,
 * per-segment tooltips, and a legend that directly labels every part with count + share,
 * so identity never depends on color alone.
 */
export function StackedShareBar({ segments, label }: { segments: Segment[]; label: string }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const share = (value: number) => (total ? Math.round((value / total) * 100) : 0);

  return (
    <div className="space-y-3">
      <div
        className="flex h-3 w-full gap-0.5 overflow-hidden rounded-[4px]"
        role="img"
        aria-label={label}
      >
        {segments
          .filter((s) => s.value > 0)
          .map((segment) => (
            <Tooltip key={segment.key}>
              <TooltipTrigger asChild>
                <div
                  tabIndex={0}
                  className="h-full transition-opacity outline-none hover:opacity-80 focus-visible:opacity-80"
                  style={{ width: `${(segment.value / total) * 100}%`, background: segment.color }}
                  aria-label={`${segment.label}: ${formatNumber(segment.value)} (${share(segment.value)}%)`}
                />
              </TooltipTrigger>
              <TooltipContent>
                <span className="font-semibold">{formatNumber(segment.value)}</span>{" "}
                <span className="opacity-80">
                  {segment.label} · {share(segment.value)}%
                </span>
              </TooltipContent>
            </Tooltip>
          ))}
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {segments.map((segment) => (
          <li key={segment.key} className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-[3px]"
              style={{ background: segment.color }}
              aria-hidden
            />
            <span className="text-muted-foreground truncate">{segment.label}</span>
            <span className="ml-auto font-medium tabular-nums">{formatNumber(segment.value)}</span>
            <span className="text-muted-foreground w-9 text-right text-xs tabular-nums">
              {share(segment.value)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
