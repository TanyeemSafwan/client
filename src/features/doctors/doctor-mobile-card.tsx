"use client";

import { Building2, Phone, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber } from "@/lib/format";
import type { DoctorListItem } from "@/types/domain";
import { DoctorIdentity, DoctorRowActions } from "./columns";

type Props = {
  doctor: DoctorListItem;
  canWrite: boolean;
  onEdit: (doctor: DoctorListItem) => void;
  onDelete: (doctor: DoctorListItem) => void;
};

/** Doctor row as a card for small screens. */
export function DoctorMobileCard({ doctor, ...actions }: Props) {
  return (
    <div className="bg-card space-y-3 rounded-xl border p-4">
      <div className="flex items-start justify-between gap-2">
        <DoctorIdentity doctor={doctor} />
        <DoctorRowActions doctor={doctor} {...actions} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{doctor.specialization}</Badge>
        <span className="text-muted-foreground text-xs">Joined {formatDate(doctor.createdAt)}</span>
      </div>
      <dl className="text-muted-foreground grid gap-1.5 text-sm">
        <div className="flex items-center gap-2">
          <Building2 className="size-4 shrink-0" />
          <dt className="sr-only">Hospital</dt>
          <dd className="truncate">{doctor.hospital}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="size-4 shrink-0" />
          <dt className="sr-only">Phone</dt>
          <dd className="tabular-nums">{doctor.phone}</dd>
        </div>
        <div className="flex items-center gap-2">
          <UsersRound className="size-4 shrink-0" />
          <dt className="sr-only">Patients</dt>
          <dd>
            <span className="text-foreground font-medium">{formatNumber(doctor.patientCount)}</span>{" "}
            patients
          </dd>
        </div>
      </dl>
    </div>
  );
}
