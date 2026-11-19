"use client";

import { CalendarDays, Stethoscope } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { GENDER_LABELS } from "@/constants/domain";
import { formatDate } from "@/lib/format";
import type { Patient } from "@/types/domain";
import { PatientRowActions, StatusBadge, type PatientActions } from "./columns";

/** Patient row as a card for small screens. */
export function PatientMobileCard({
  patient,
  showDoctor = true,
  ...actions
}: PatientActions & { patient: Patient; showDoctor?: boolean }) {
  return (
    <div className="bg-card space-y-3 rounded-xl border p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium">{patient.name}</p>
          <p className="text-muted-foreground text-xs">
            {patient.age} · {GENDER_LABELS[patient.gender]} ·{" "}
            <span className="tabular-nums">{patient.phone}</span>
          </p>
        </div>
        <PatientRowActions patient={patient} {...actions} />
      </div>
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={patient.status} />
        <Badge variant="secondary">{patient.condition}</Badge>
      </div>
      <dl className="text-muted-foreground grid gap-1.5 text-sm">
        {showDoctor && patient.doctor && (
          <div className="flex items-center gap-2">
            <Stethoscope className="size-4 shrink-0" />
            <dt className="sr-only">Doctor</dt>
            <dd className="truncate">
              <Link href={`/doctors/${patient.doctor._id}`} className="hover:underline">
                Dr. {patient.doctor.name}
              </Link>
            </dd>
          </div>
        )}
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 shrink-0" />
          <dt className="sr-only">Admitted</dt>
          <dd>Admitted {formatDate(patient.admissionDate)}</dd>
        </div>
      </dl>
    </div>
  );
}
