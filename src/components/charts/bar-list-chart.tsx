"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatNumber } from "@/lib/format";
import { barListHeight } from "./chart-sizes";

type TickProps = { x?: number; y?: number; payload?: { value: string }; maxChars: number };

/** One-line axis label, truncated with "…" (Recharts wraps long ticks by default). */
function SingleLineTick({ x = 0, y = 0, payload, maxChars }: TickProps) {
  const label = payload?.value ?? "";
  const short = label.length > maxChars ? `${label.slice(0, maxChars - 1)}…` : label;
  return (
    <text x={x - 8} y={y} dy={4} textAnchor="end" fontSize={12} className="fill-muted-foreground">
      {short}
      {short !== label && <title>{label}</title>}
    </text>
  );
}

export type BarDatum = { key: string; label: string; value: number };

const BAR_SIZE = 16; // thin marks: <= 24px

/**
 * Horizontal bars, one color for all (nominal categories → no value ramp), value at the tip.
 * Bars are clickable when `onSelect` is given (e.g. drill into a filtered list).
 */
export function BarListChart({
  data,
  valueLabel,
  onSelect,
  labelWidth = 128,
  maxLabelChars = 20,
}: {
  data: BarDatum[];
  valueLabel: string;
  onSelect?: (datum: BarDatum) => void;
  labelWidth?: number;
  maxLabelChars?: number;
}) {
  const config = {
    value: { label: valueLabel, color: "var(--chart-series)" },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={config}
      className="aspect-auto w-full"
      style={{ height: barListHeight(data.length) }}
    >
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
        barCategoryGap={2}
      >
        <CartesianGrid horizontal={false} stroke="var(--border)" />
        {/* Scale ends at the largest value (no "nice" rounding that leaves dead space). */}
        <XAxis type="number" hide domain={[0, "dataMax"]} />
        <YAxis
          type="category"
          dataKey="label"
          width={labelWidth}
          tickLine={false}
          axisLine={false}
          interval={0}
          tick={<SingleLineTick maxChars={maxLabelChars} />}
        />
        <ChartTooltip
          cursor={{ fill: "var(--muted)", opacity: 0.6 }}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Bar
          dataKey="value"
          fill="var(--color-value)"
          barSize={BAR_SIZE}
          radius={[0, 4, 4, 0]}
          activeBar={{ fillOpacity: 0.8 }}
          className={onSelect ? "cursor-pointer" : undefined}
          onClick={(entry) => {
            const datum = (entry as { payload?: BarDatum }).payload;
            if (onSelect && datum) onSelect(datum);
          }}
        >
          <LabelList
            dataKey="value"
            position="right"
            offset={8}
            className="fill-foreground"
            fontSize={12}
            formatter={(value: unknown) => formatNumber(Number(value))}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
