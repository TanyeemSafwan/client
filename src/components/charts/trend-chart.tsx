"use client";

import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatNumber, utcDay } from "@/lib/format";
import type { Granularity } from "@/types/dashboard";

const config = {
  count: { label: "New patients", color: "var(--chart-series)" },
} satisfies ChartConfig;

const TICK_FORMAT: Record<Granularity, string> = { day: "MMM d", week: "MMM d", month: "MMM yy" };
const LABEL_FORMAT: Record<Granularity, (d: Date) => string> = {
  day: (d) => format(d, "EEE, MMM d, yyyy"),
  week: (d) => `Week of ${format(d, "MMM d, yyyy")}`,
  month: (d) => format(d, "MMMM yyyy"),
};

/** Single-series area (2px line + ~10% wash) with crosshair tooltip. */
export function TrendChart({
  points,
  granularity,
  height,
}: {
  points: Array<{ date: string; count: number }>;
  granularity: Granularity;
  height: number;
}) {
  return (
    <ChartContainer config={config} className="aspect-auto w-full" style={{ height }}>
      <AreaChart data={points} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-count)" stopOpacity={0.18} />
            <stop offset="100%" stopColor="var(--color-count)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={24}
          tickFormatter={(iso: string) => format(utcDay(iso), TICK_FORMAT[granularity])}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={44}
          allowDecimals={false}
          tickFormatter={(v: number) => formatNumber(v)}
        />
        <ChartTooltip
          cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1 }}
          content={
            <ChartTooltipContent
              indicator="line"
              labelFormatter={(_, payload) => {
                const iso = payload?.[0]?.payload?.date as string | undefined;
                if (!iso) return "";
                const isCurrent = iso === points.at(-1)?.date;
                // The last bucket is still in progress, so its count is naturally lower.
                return `${LABEL_FORMAT[granularity](utcDay(iso))}${isCurrent ? " (in progress)" : ""}`;
              }}
            />
          }
        />
        <Area
          dataKey="count"
          type="monotone"
          stroke="var(--color-count)"
          strokeWidth={2}
          fill="url(#trend-fill)"
          activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
          dot={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}
