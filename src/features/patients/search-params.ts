"use client";

import { parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { AGE_GROUPS, CONDITIONS, GENDERS, PATIENT_STATUSES } from "@/constants/domain";
import { dateRangeParsers, paginationParsers } from "@/lib/search-params";

export const PATIENT_SORTS = ["admissionDate", "name", "age"] as const;

const patientSearchParams = {
  ...paginationParsers,
  ...dateRangeParsers,
  search: parseAsString.withDefault(""),
  condition: parseAsArrayOf(parseAsStringLiteral(CONDITIONS)).withDefault([]),
  status: parseAsArrayOf(parseAsStringLiteral(PATIENT_STATUSES)).withDefault([]),
  gender: parseAsArrayOf(parseAsStringLiteral(GENDERS)).withDefault([]),
  age: parseAsStringLiteral(AGE_GROUPS.map((g) => g.value)),
  doctor: parseAsString.withDefault(""),
  sort: parseAsStringLiteral(PATIENT_SORTS).withDefault("admissionDate"),
};

/** Patient list state in the URL. `setFilters` resets to page 1 unless a page is given. */
export function usePatientFilters() {
  const [filters, setParams] = useQueryStates(patientSearchParams, { history: "push" });

  const setFilters = (patch: Partial<typeof filters>) => setParams({ page: 1, ...patch });

  const resetFilters = () =>
    setParams({
      page: 1,
      search: "",
      condition: [],
      status: [],
      gender: [],
      age: null,
      doctor: "",
      from: null,
      to: null,
    });

  const isFiltered = Boolean(
    filters.search ||
    filters.condition.length ||
    filters.status.length ||
    filters.gender.length ||
    filters.age ||
    filters.doctor ||
    filters.from ||
    filters.to,
  );

  return { filters, setFilters, resetFilters, isFiltered };
}

export type PatientFilterState = ReturnType<typeof usePatientFilters>;
export type PatientFilters = PatientFilterState["filters"];
