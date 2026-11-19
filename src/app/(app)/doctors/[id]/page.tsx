import type { Metadata } from "next";
import { Suspense } from "react";
import { TablePageSkeleton } from "@/components/shared/table-page-skeleton";
import { DoctorDetailView } from "@/features/doctors/doctor-detail-view";

export const metadata: Metadata = { title: "Doctor details" };

export default function DoctorDetailPage() {
  return (
    // useParams (unknown id) and URL filters need a Suspense boundary under cacheComponents.
    <Suspense fallback={<TablePageSkeleton />}>
      <DoctorDetailView />
    </Suspense>
  );
}
