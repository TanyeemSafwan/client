import type { Metadata } from "next";
import { Suspense } from "react";
import { TablePageSkeleton } from "@/components/shared/table-page-skeleton";
import { PatientsView } from "@/features/patients/patients-view";

export const metadata: Metadata = { title: "Patients" };

export default function PatientsPage() {
  return (
    // PatientsView reads filters from the URL (nuqs), which needs a Suspense boundary.
    <Suspense fallback={<TablePageSkeleton />}>
      <PatientsView />
    </Suspense>
  );
}
