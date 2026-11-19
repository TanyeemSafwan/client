import type { Metadata } from "next";
import { Suspense } from "react";
import { TablePageSkeleton } from "@/components/shared/table-page-skeleton";
import { DoctorsView } from "@/features/doctors/doctors-view";

export const metadata: Metadata = { title: "Doctors" };

export default function DoctorsPage() {
  return (
    // DoctorsView reads filters from the URL (nuqs), which needs a Suspense boundary.
    <Suspense fallback={<TablePageSkeleton />}>
      <DoctorsView />
    </Suspense>
  );
}
