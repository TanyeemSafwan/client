"use client";

import type { SortingState } from "@tanstack/react-table";
import { Plus, SearchX, Stethoscope } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { useCan } from "@/features/auth/hooks";
import { errorMessage } from "@/lib/form-errors";
import { formatNumber } from "@/lib/format";
import type { Doctor, DoctorListItem } from "@/types/domain";
import { createDoctorColumns } from "./columns";
import { DoctorFilters } from "./doctor-filters";
import { DoctorFormDialog } from "./doctor-form-dialog";
import { DoctorMobileCard } from "./doctor-mobile-card";
import { useDeleteDoctor, useDoctors } from "./hooks";
import { DOCTOR_SORTS, useDoctorFilters } from "./search-params";

export function DoctorsView() {
  const filterState = useDoctorFilters();
  const { filters, setFilters, resetFilters, isFiltered } = filterState;
  const doctors = useDoctors(filters);
  const deleteDoctor = useDeleteDoctor();
  const canWrite = useCan("doctor:write");

  const [form, setForm] = useState<{ open: boolean; doctor: Doctor | null }>({
    open: false,
    doctor: null,
  });
  const [toDelete, setToDelete] = useState<DoctorListItem | null>(null);

  const actions = {
    canWrite,
    onEdit: (doctor: DoctorListItem) => setForm({ open: true, doctor }),
    onDelete: setToDelete,
  };
  const columns = createDoctorColumns(actions);

  const sorting: SortingState = [{ id: filters.sort, desc: filters.order === "desc" }];
  const onSortingChange = ([sort]: SortingState) => {
    if (!sort) return;
    const id = DOCTOR_SORTS.find((s) => s === sort.id);
    if (id) setFilters({ sort: id, order: sort.desc ? "desc" : "asc" });
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    deleteDoctor.mutate(toDelete._id, {
      onSuccess: () => {
        toast.success(`Dr. ${toDelete.name} removed`);
        // Deleted the only row on a later page → step back a page.
        if (doctors.data?.data.length === 1 && filters.page > 1) {
          setFilters({ page: filters.page - 1 });
        }
        setToDelete(null);
      },
      onError: (error) => {
        toast.error(errorMessage(error));
        setToDelete(null);
      },
    });
  };

  const total = doctors.data?.meta.total;

  return (
    <>
      <PageHeader
        title="Doctors"
        description={
          total === undefined
            ? "Manage doctors and their patients."
            : `${formatNumber(total)} ${isFiltered ? "matching" : "registered"} doctor${total === 1 ? "" : "s"}`
        }
        actions={
          canWrite && (
            <Button onClick={() => setForm({ open: true, doctor: null })}>
              <Plus /> Add doctor
            </Button>
          )
        }
      />

      <DoctorFilters {...filterState} />

      {doctors.isError && !doctors.data ? (
        <div className="bg-card rounded-xl border">
          <ErrorState message={errorMessage(doctors.error)} onRetry={() => doctors.refetch()} />
        </div>
      ) : (
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={doctors.data?.data}
            getRowId={(doctor) => doctor._id}
            isLoading={doctors.isPending}
            isFetching={doctors.isPlaceholderData}
            sorting={sorting}
            onSortingChange={onSortingChange}
            renderMobileCard={(doctor) => <DoctorMobileCard doctor={doctor} {...actions} />}
            emptyState={
              isFiltered ? (
                <EmptyState
                  icon={SearchX}
                  title="No doctors match your filters"
                  description="Try a different search or clear the filters."
                  action={
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      Reset filters
                    </Button>
                  }
                />
              ) : (
                <EmptyState
                  icon={Stethoscope}
                  title="No doctors yet"
                  description="Add your first doctor to start tracking patients."
                  action={
                    canWrite && (
                      <Button size="sm" onClick={() => setForm({ open: true, doctor: null })}>
                        <Plus /> Add doctor
                      </Button>
                    )
                  }
                />
              )
            }
          />
          <DataTablePagination
            meta={doctors.data?.meta}
            noun="doctors"
            onPageChange={(page) => setFilters({ page })}
            onLimitChange={(limit) => setFilters({ limit })}
          />
        </div>
      )}

      <DoctorFormDialog
        open={form.open}
        doctor={form.doctor}
        onOpenChange={(open) => setForm((current) => ({ ...current, open }))}
      />

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={`Delete Dr. ${toDelete?.name ?? ""}?`}
        description={
          toDelete?.patientCount
            ? `This doctor has ${formatNumber(toDelete.patientCount)} patient(s). Reassign or delete them before removing the doctor.`
            : "This permanently removes the doctor. This can't be undone."
        }
        isPending={deleteDoctor.isPending}
        onConfirm={confirmDelete}
      />
    </>
  );
}
