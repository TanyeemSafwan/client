"use client";

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Mail,
  Pencil,
  Phone,
  Trash2,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PATIENT_STATUSES, STATUS_META } from "@/constants/domain";
import { useCan } from "@/features/auth/hooks";
import { PatientsTable } from "@/features/patients/patients-table";
import { ApiError } from "@/lib/api-client";
import { errorMessage } from "@/lib/form-errors";
import { formatDate, formatNumber, initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DoctorDetail } from "@/types/domain";
import { DoctorFormDialog } from "./doctor-form-dialog";
import { useDeleteDoctor, useDoctor } from "./hooks";

function BackLink() {
  return (
    <Button variant="ghost" size="sm" asChild className="text-muted-foreground -ml-2 w-fit">
      <Link href="/doctors">
        <ArrowLeft /> All doctors
      </Link>
    </Button>
  );
}

function StatTile({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className?: string;
}) {
  return (
    <div className="bg-card rounded-xl border p-4">
      <p className="text-muted-foreground text-xs font-medium">{label}</p>
      <p className={cn("mt-1 text-2xl font-semibold tabular-nums", className)}>
        {formatNumber(value)}
      </p>
    </div>
  );
}

function ProfileCard({
  doctor,
  canWrite,
  onEdit,
  onDelete,
}: {
  doctor: DoctorDetail;
  canWrite: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <section className="bg-card rounded-xl border p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {initials(doctor.name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">Dr. {doctor.name}</h1>
            <Badge variant="secondary">{doctor.specialization}</Badge>
          </div>
        </div>
        {canWrite && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={onEdit}>
              <Pencil /> Edit
            </Button>
            <Button
              variant="outline"
              onClick={onDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 /> Delete
            </Button>
          </div>
        )}
      </div>

      <dl className="text-muted-foreground mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-2">
          <Building2 className="size-4 shrink-0" />
          <dt className="sr-only">Hospital</dt>
          <dd className="truncate">{doctor.hospital}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="size-4 shrink-0" />
          <dt className="sr-only">Email</dt>
          <dd className="truncate">
            <a href={`mailto:${doctor.email}`} className="hover:text-foreground hover:underline">
              {doctor.email}
            </a>
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="size-4 shrink-0" />
          <dt className="sr-only">Phone</dt>
          <dd className="tabular-nums">
            <a
              href={`tel:${doctor.phone.replace(/\s/g, "")}`}
              className="hover:text-foreground hover:underline"
            >
              {doctor.phone}
            </a>
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 shrink-0" />
          <dt className="sr-only">Joined</dt>
          <dd>Joined {formatDate(doctor.createdAt)}</dd>
        </div>
      </dl>
    </section>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-44 rounded-xl" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}

export function DoctorDetailView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const doctor = useDoctor(id);
  const deleteDoctor = useDeleteDoctor();
  const canWrite = useCan("doctor:write");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (doctor.isPending) return <DetailSkeleton />;

  if (doctor.isError) {
    const notFound =
      doctor.error instanceof ApiError &&
      (doctor.error.status === 404 || doctor.error.status === 400);
    return (
      <div className="space-y-6">
        <BackLink />
        <div className="bg-card rounded-xl border">
          {notFound ? (
            <EmptyState
              icon={UserX}
              title="Doctor not found"
              description="This doctor doesn't exist or was removed."
              action={
                <Button asChild size="sm">
                  <Link href="/doctors">Back to doctors</Link>
                </Button>
              }
            />
          ) : (
            <ErrorState message={errorMessage(doctor.error)} onRetry={() => doctor.refetch()} />
          )}
        </div>
      </div>
    );
  }

  const data = doctor.data;
  const byStatus = data.patientsByStatus;

  const confirmDelete = () =>
    deleteDoctor.mutate(data._id, {
      onSuccess: () => {
        toast.success(`Dr. ${data.name} removed`);
        router.replace("/doctors");
      },
      onError: (error) => {
        toast.error(errorMessage(error));
        setDeleteOpen(false);
      },
    });

  return (
    <>
      <BackLink />
      <ProfileCard
        doctor={data}
        canWrite={canWrite}
        onEdit={() => setEditOpen(true)}
        onDelete={() => setDeleteOpen(true)}
      />

      <section aria-label="Patient summary" className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatTile label="Total patients" value={data.patientCount} />
        {PATIENT_STATUSES.map((status) => (
          <StatTile key={status} label={STATUS_META[status].label} value={byStatus[status] ?? 0} />
        ))}
      </section>

      <section className="space-y-4">
        <PatientsTable
          doctor={{ _id: data._id, name: data.name }}
          header={(addButton, total) => (
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Patients</h2>
                <p className="text-muted-foreground text-sm">
                  {total === undefined
                    ? "Patients under this doctor's care."
                    : `${formatNumber(total)} shown with current filters`}
                </p>
              </div>
              {addButton}
            </div>
          )}
        />
      </section>

      <DoctorFormDialog open={editOpen} onOpenChange={setEditOpen} doctor={data} />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete Dr. ${data.name}?`}
        description={
          data.patientCount
            ? `This doctor has ${formatNumber(data.patientCount)} patient(s). Reassign or delete them before removing the doctor.`
            : "This permanently removes the doctor. This can't be undone."
        }
        isPending={deleteDoctor.isPending}
        onConfirm={confirmDelete}
      />
    </>
  );
}
