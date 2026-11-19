"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, formatNumber, initials } from "@/lib/format";
import type { DoctorListItem } from "@/types/domain";

type Actions = {
  canWrite: boolean;
  onEdit: (doctor: DoctorListItem) => void;
  onDelete: (doctor: DoctorListItem) => void;
};

export function DoctorRowActions({
  doctor,
  canWrite,
  onEdit,
  onDelete,
}: Actions & { doctor: DoctorListItem }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${doctor.name}`}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem asChild>
          <Link href={`/doctors/${doctor._id}`}>
            <Eye /> View details
          </Link>
        </DropdownMenuItem>
        {canWrite && (
          <>
            <DropdownMenuItem onSelect={() => onEdit(doctor)}>
              <Pencil /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => onDelete(doctor)}>
              <Trash2 /> Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DoctorIdentity({
  doctor,
}: {
  doctor: Pick<DoctorListItem, "_id" | "name" | "email">;
}) {
  return (
    <Link href={`/doctors/${doctor._id}`} className="group flex items-center gap-3">
      <Avatar className="size-9">
        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
          {initials(doctor.name)}
        </AvatarFallback>
      </Avatar>
      <span className="min-w-0">
        <span className="block truncate font-medium group-hover:underline">Dr. {doctor.name}</span>
        <span className="text-muted-foreground block truncate text-xs">{doctor.email}</span>
      </span>
    </Link>
  );
}

export function createDoctorColumns(actions: Actions): ColumnDef<DoctorListItem>[] {
  return [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Doctor" />,
      cell: ({ row }) => <DoctorIdentity doctor={row.original} />,
    },
    {
      accessorKey: "specialization",
      header: "Specialization",
      enableSorting: false,
      cell: ({ row }) => <Badge variant="secondary">{row.original.specialization}</Badge>,
    },
    {
      accessorKey: "hospital",
      header: "Hospital",
      enableSorting: false,
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.hospital}</span>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-muted-foreground whitespace-nowrap tabular-nums">
          {row.original.phone}
        </span>
      ),
    },
    {
      id: "patientCount",
      accessorKey: "patientCount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Patients" />,
      cell: ({ row }) => (
        <span className="font-medium tabular-nums">{formatNumber(row.original.patientCount)}</span>
      ),
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Joined" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground whitespace-nowrap">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DoctorRowActions doctor={row.original} {...actions} />
        </div>
      ),
    },
  ];
}
