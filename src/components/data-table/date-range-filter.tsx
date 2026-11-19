"use client";

import { endOfDay, startOfDay, startOfYear, subDays, subMonths } from "date-fns";
import { CalendarDays, X } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDate, formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export type DateRangeValue = { from: Date | null; to: Date | null };

type Preset = { label: string; range: () => DateRangeValue };

// Computed on click (never during render), so cacheComponents prerendering stays deterministic.
export const DATE_PRESETS: Preset[] = [
  {
    label: "Last 7 days",
    range: () => ({ from: subDays(startOfDay(new Date()), 6), to: startOfDay(new Date()) }),
  },
  {
    label: "Last 30 days",
    range: () => ({ from: subDays(startOfDay(new Date()), 29), to: startOfDay(new Date()) }),
  },
  {
    label: "Last 90 days",
    range: () => ({ from: subDays(startOfDay(new Date()), 89), to: startOfDay(new Date()) }),
  },
  {
    label: "Last 12 months",
    range: () => ({ from: subMonths(startOfDay(new Date()), 12), to: startOfDay(new Date()) }),
  },
  {
    label: "This year",
    range: () => ({ from: startOfYear(new Date()), to: startOfDay(new Date()) }),
  },
];

function rangeLabel({ from, to }: DateRangeValue) {
  if (from && to) {
    const sameYear = from.getFullYear() === to.getFullYear();
    return `${sameYear ? formatShortDate(from) : formatDate(from)} – ${formatDate(to)}`;
  }
  if (from) return `From ${formatDate(from)}`;
  if (to) return `Until ${formatDate(to)}`;
  return null;
}

export function DateRangeFilter({
  title,
  value,
  onChange,
  className,
}: {
  title: string;
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  // "Today" for disabling future days; captured when the popover opens, not during render.
  const [today, setToday] = useState<Date | null>(null);
  const label = rangeLabel(value);
  const selected: DateRange | undefined = value.from
    ? { from: value.from, to: value.to ?? undefined }
    : undefined;

  const apply = (next: DateRangeValue) => {
    onChange(next);
    if (next.from && next.to) setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) setToday(endOfDay(new Date()));
        setOpen(next);
      }}
    >
      <div className={cn("relative", className)}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("border-dashed", label && "pr-8")}>
            <CalendarDays />
            {label ? (
              <span className="text-foreground">
                <span className="text-muted-foreground">{title}: </span>
                {label}
              </span>
            ) : (
              title
            )}
          </Button>
        </PopoverTrigger>
        {label && (
          <button
            type="button"
            onClick={() => onChange({ from: null, to: null })}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-0.5"
            aria-label={`Clear ${title} filter`}
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
      <PopoverContent className="flex w-auto flex-col p-0 sm:flex-row" align="start">
        <div className="flex flex-wrap gap-1 border-b p-2 sm:w-36 sm:flex-col sm:border-r sm:border-b-0">
          {DATE_PRESETS.map((preset) => (
            <Button
              key={preset.label}
              variant="ghost"
              size="sm"
              className="justify-start"
              onClick={() => apply(preset.range())}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <Calendar
          mode="range"
          numberOfMonths={1}
          defaultMonth={value.from ?? undefined}
          selected={selected}
          onSelect={(range) =>
            apply({
              from: range?.from ? startOfDay(range.from) : null,
              to: range?.to ? startOfDay(range.to) : null,
            })
          }
          disabled={today ? { after: today } : undefined}
        />
      </PopoverContent>
    </Popover>
  );
}
