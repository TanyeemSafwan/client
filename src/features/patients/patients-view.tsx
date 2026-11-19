"use client";

import { PageHeader } from "@/components/layout/page-header";
import { formatNumber } from "@/lib/format";
import { PatientsTable } from "./patients-table";

export function PatientsView() {
  return (
    <PatientsTable
      header={(addButton, total) => (
        <PageHeader
          title="Patients"
          description={
            total === undefined
              ? "Search, filter and manage every patient."
              : `${formatNumber(total)} patient${total === 1 ? "" : "s"} match the current filters`
          }
          actions={addButton}
        />
      )}
    />
  );
}
