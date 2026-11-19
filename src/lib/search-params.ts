import { format, isValid, parse } from "date-fns";
import { createParser, parseAsInteger, parseAsNumberLiteral, parseAsStringLiteral } from "nuqs";
import { PAGE_SIZES } from "@/constants/domain";

/**
 * `?from=2026-01-05` ↔ a local Date at midnight.
 * (nuqs' parseAsIsoDate serializes in UTC, which shifts the day in timezones east of UTC.)
 */
export const parseAsLocalDate = createParser({
  parse: (value) => {
    const date = parse(value, "yyyy-MM-dd", new Date());
    return isValid(date) ? date : null;
  },
  serialize: (date) => format(date, "yyyy-MM-dd"),
  eq: (a, b) => a.getTime() === b.getTime(),
});

/** Shared list params. Defaults are omitted from the URL (nuqs clearOnDefault). */
export const paginationParsers = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsNumberLiteral(PAGE_SIZES).withDefault(10),
  order: parseAsStringLiteral(["asc", "desc"] as const).withDefault("desc"),
};

export const dateRangeParsers = {
  from: parseAsLocalDate,
  to: parseAsLocalDate,
};
