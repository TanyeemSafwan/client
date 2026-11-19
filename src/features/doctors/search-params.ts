"use client";

import { parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { SPECIALIZATIONS } from "@/constants/domain";
import { dateRangeParsers, paginationParsers } from "@/lib/search-params";

export const DOCTOR_SORTS = ["createdAt", "name", "patientCount"] as const;

const doctorSearchParams = {
  ...paginationParsers,
  ...dateRangeParsers,
  search: parseAsString.withDefault(""),
  specialization: parseAsArrayOf(parseAsStringLiteral(SPECIALIZATIONS)).withDefault([]),
  hospital: parseAsString.withDefault(""),
  sort: parseAsStringLiteral(DOCTOR_SORTS).withDefault("createdAt"),
};

/**
 * Doctor list state lives in the URL (shareable, back-button friendly).
 * `setFilters` jumps back to page 1 unless a page is given explicitly.
 */
export function useDoctorFilters() {
  const [filters, setParams] = useQueryStates(doctorSearchParams, { history: "push" });

  const setFilters = (patch: Partial<typeof filters>) => setParams({ page: 1, ...patch });

  const resetFilters = () =>
    setParams({ page: 1, search: "", specialization: [], hospital: "", from: null, to: null });

  const isFiltered = Boolean(
    filters.search ||
    filters.specialization.length ||
    filters.hospital ||
    filters.from ||
    filters.to,
  );

  return { filters, setFilters, resetFilters, isFiltered };
}

export type DoctorFilters = ReturnType<typeof useDoctorFilters>["filters"];
