import { format, parse, parseISO } from "date-fns";

const numberFormatter = new Intl.NumberFormat("en-US");

export function formatNumber(value: number) {
  return numberFormatter.format(value);
}

/** "Jan 5, 2026" from an ISO string or Date. */
export function formatDate(value: string | Date) {
  return format(typeof value === "string" ? parseISO(value) : value, "MMM d, yyyy");
}

/** "Jan 5" (current-year style, for compact labels). */
export function formatShortDate(value: string | Date) {
  return format(typeof value === "string" ? parseISO(value) : value, "MMM d");
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/**
 * Dashboard buckets are UTC days ("2026-11-03T00:00:00.000Z"). Read the calendar date part so
 * timezones west of UTC don't show the previous day.
 */
export function utcDay(iso: string) {
  return parse(iso.slice(0, 10), "yyyy-MM-dd", new Date(0));
}

const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** 1,284 / 12.9K / 4.2M — compact only from 10,000 up. */
export function formatCompact(value: number) {
  return value >= 10_000 ? compactFormatter.format(value) : formatNumber(value);
}
