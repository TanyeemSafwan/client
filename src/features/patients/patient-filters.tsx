"use client";

import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DateRangeFilter } from "@/components/data-table/date-range-filter";
import { FacetFilter } from "@/components/data-table/facet-filter";
import { SearchInput } from "@/components/data-table/search-input";
import {
  AGE_GROUPS,
  CONDITIONS,
  GENDER_LABELS,
  GENDERS,
  PATIENT_STATUSES,
  STATUS_META,
} from "@/constants/domain";
import { DoctorPicker } from "@/features/doctors/doctor-picker";
import type { PatientFilterState } from "./search-params";

const CONDITION_OPTIONS = CONDITIONS.map((value) => ({ value, label: value }));
const STATUS_OPTIONS = PATIENT_STATUSES.map((value) => ({
  value,
  label: STATUS_META[value].label,
}));
const GENDER_OPTIONS = GENDERS.map((value) => ({ value, label: GENDER_LABELS[value] }));
const AGE_OPTIONS = AGE_GROUPS.map(({ value, label }) => ({ value, label }));

export function PatientFilters({
  filters,
  setFilters,
  resetFilters,
  isFiltered,
  showDoctorFilter = true,
}: PatientFilterState & { showDoctorFilter?: boolean }) {
  return (
    <DataTableToolbar isFiltered={isFiltered} onReset={resetFilters}>
      <SearchInput
        value={filters.search}
        onChange={(search) => setFilters({ search })}
        placeholder="Search name, phone or email…"
      />
      <div className="flex flex-wrap gap-2">
        <FacetFilter
          title="Condition"
          options={CONDITION_OPTIONS}
          selected={filters.condition}
          onChange={(condition) => setFilters({ condition })}
        />
        <FacetFilter
          title="Status"
          options={STATUS_OPTIONS}
          selected={filters.status}
          onChange={(status) => setFilters({ status })}
        />
        <FacetFilter
          title="Gender"
          options={GENDER_OPTIONS}
          selected={filters.gender}
          onChange={(gender) => setFilters({ gender })}
        />
        <FacetFilter
          single
          title="Age"
          options={AGE_OPTIONS}
          selected={filters.age ? [filters.age] : []}
          onChange={([age]) => setFilters({ age: age ?? null })}
        />
        <DateRangeFilter
          title="Admitted"
          value={{ from: filters.from, to: filters.to }}
          onChange={({ from, to }) => setFilters({ from, to })}
        />
        {showDoctorFilter && (
          <DoctorPicker
            value={filters.doctor}
            onChange={(doctor) => setFilters({ doctor })}
            placeholder="Any doctor"
            className="w-auto max-w-56 border-dashed"
          />
        )}
      </div>
    </DataTableToolbar>
  );
}
