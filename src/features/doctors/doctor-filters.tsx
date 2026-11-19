"use client";

import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DateRangeFilter } from "@/components/data-table/date-range-filter";
import { FacetFilter } from "@/components/data-table/facet-filter";
import { SearchInput } from "@/components/data-table/search-input";
import { SPECIALIZATIONS } from "@/constants/domain";
import { useDoctorFilterOptions } from "./hooks";
import type { useDoctorFilters } from "./search-params";

const SPECIALIZATION_OPTIONS = SPECIALIZATIONS.map((value) => ({ value, label: value }));

export function DoctorFilters({
  filters,
  setFilters,
  resetFilters,
  isFiltered,
}: ReturnType<typeof useDoctorFilters>) {
  const { data: filterOptions } = useDoctorFilterOptions();
  const hospitalOptions = (filterOptions?.hospitals ?? []).map((value) => ({
    value,
    label: value,
  }));

  return (
    <DataTableToolbar isFiltered={isFiltered} onReset={resetFilters}>
      <SearchInput
        value={filters.search}
        onChange={(search) => setFilters({ search })}
        placeholder="Search name or email…"
      />
      <div className="flex flex-wrap gap-2">
        <FacetFilter
          title="Specialization"
          options={SPECIALIZATION_OPTIONS}
          selected={filters.specialization}
          onChange={(specialization) => setFilters({ specialization })}
        />
        <FacetFilter
          single
          title="Hospital"
          options={hospitalOptions}
          selected={filters.hospital ? [filters.hospital] : []}
          onChange={([hospital]) => setFilters({ hospital: hospital ?? "" })}
        />
        <DateRangeFilter
          title="Joined"
          value={{ from: filters.from, to: filters.to }}
          onChange={({ from, to }) => setFilters({ from, to })}
        />
      </div>
    </DataTableToolbar>
  );
}
