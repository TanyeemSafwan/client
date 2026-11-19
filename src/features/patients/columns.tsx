"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GENDER_LABELS, STATUS_META, type PatientStatus } from "@/constants/domain";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Patient } from "@/types/domain";

export type PatientActions = {
  canWrite: boolean;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
};

export function StatusBadge({ status }: { status: PatientStatus }) {
  const meta = STATUS_META[status];
  return (
    <Badge variant="outline" className={cn("font-medium", meta.className)}>
      {meta.label}
    </Badge>
  );
}

export function PatientRowActions({
  patient,
  canWrite,
  onEdit,
  onDelete,
}: PatientActions & { patient: Patient }) {
  if (!canWrite) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${patient.name}`}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem onSelect={() => onEdit(patient)}>
          <Pencil /> Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(patient)}>
          <Trash2 /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function createPatientColumns(
  actions: PatientActions,
  { showDoctor = true }: { showDoctor?: boolean } = {},
): ColumnDef<Patient>[] {
  const columns: (ColumnDef<Patient> | false)[] = [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{row.original.name}</p>
          <p className="text-muted-foreground truncate text-xs tabular-nums">
            {row.original.phone}
          </p>
        </div>
      ),
    },
    {
      id: "age",
      accessorKey: "age",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Age" />,
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row.original.age}
          <span className="text-muted-foreground"> · {GENDER_LABELS[row.original.gender]}</span>
        </span>
      ),
    },
    {
      accessorKey: "condition",
      header: "Condition",
      enableSorting: false,
      cell: ({ row }) => <Badge variant="secondary">{row.original.condition}</Badge>,
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: false,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    showDoctor && {
      id: "doctor",
      header: "Doctor",
      enableSorting: false,
      cell: ({ row }) =>
        row.original.doctor ? (
          <Link href={`/doctors/${row.original.doctor._id}`} className="hover:underline">
            <span className="block truncate">Dr. {row.original.doctor.name}</span>
            <span className="text-muted-foreground block truncate text-xs">
              {row.original.doctor.specialization}
            </span>
          </Link>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      id: "admissionDate",
      accessorKey: "admissionDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Admitted" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground whitespace-nowrap">
          {formatDate(row.original.admissionDate)}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <PatientRowActions patient={row.original} {...actions} />
        </div>
      ),
    },
  ];
  return columns.filter((column): column is ColumnDef<Patient> => Boolean(column));
}
