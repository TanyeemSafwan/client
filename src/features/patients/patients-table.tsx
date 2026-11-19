"use client";

import type { SortingState } from "@tanstack/react-table";
import { Plus, SearchX, UsersRound } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { useCan } from "@/features/auth/hooks";
import { errorMessage } from "@/lib/form-errors";
import type { Patient } from "@/types/domain";
import { createPatientColumns } from "./columns";
import { useDeletePatient, usePatients } from "./hooks";
import { PatientFilters } from "./patient-filters";
import { PatientFormDialog } from "./patient-form-dialog";
import { PatientMobileCard } from "./patient-mobile-card";
import { PATIENT_SORTS, usePatientFilters } from "./search-params";

type Props = {
  /** Scope to one doctor (doctor detail page): hides the doctor column/filter, pre-fills new patients. */
  doctor?: { _id: string; name: string };
  /** Renders the section header; receives the "Add patient" button and the result total. */
  header: (addButton: ReactNode, total: number | undefined) => ReactNode;
};

/** Filterable, paginated patient table with add / edit / delete. Used on Patients and Doctor pages. */
export function PatientsTable({ doctor, header }: Props) {
  const filterState = usePatientFilters();
  const { filters, setFilters, resetFilters, isFiltered } = filterState;
  const patients = usePatients(filters, doctor?._id);
  const deletePatient = useDeletePatient();
  const canWrite = useCan("patient:write");

  const [form, setForm] = useState<{ open: boolean; patient: Patient | null }>({
    open: false,
    patient: null,
  });
  const [toDelete, setToDelete] = useState<Patient | null>(null);

  const actions = {
    canWrite,
    onEdit: (patient: Patient) => setForm({ open: true, patient }),
    onDelete: setToDelete,
  };
  const showDoctor = !doctor;
  const columns = createPatientColumns(actions, { showDoctor });

  const sorting: SortingState = [{ id: filters.sort, desc: filters.order === "desc" }];
  const onSortingChange = ([sort]: SortingState) => {
    const id = PATIENT_SORTS.find((s) => s === sort?.id);
    if (sort && id) setFilters({ sort: id, order: sort.desc ? "desc" : "asc" });
  };

  const openCreate = () => setForm({ open: true, patient: null });

  const confirmDelete = () => {
    if (!toDelete) return;
    const deleted = toDelete;
    const wasLastOnPage = patients.data?.data.length === 1 && filters.page > 1;
    setToDelete(null); // optimistic: row is already gone, close right away
    deletePatient.mutate(deleted._id, {
      onSuccess: () => {
        toast.success(`${deleted.name} deleted`);
        if (wasLastOnPage) setFilters({ page: filters.page - 1 });
      },
      onError: (error) => toast.error(`Couldn't delete ${deleted.name}: ${errorMessage(error)}`),
    });
  };

  const addButton = canWrite ? (
    <Button onClick={openCreate}>
      <Plus /> Add patient
    </Button>
  ) : null;

  return (
    <>
      {header(addButton, patients.data?.meta.total)}

      <PatientFilters {...filterState} showDoctorFilter={showDoctor} />

      {patients.isError && !patients.data ? (
        <div className="bg-card rounded-xl border">
          <ErrorState message={errorMessage(patients.error)} onRetry={() => patients.refetch()} />
        </div>
      ) : (
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={patients.data?.data}
            getRowId={(patient) => patient._id}
            isLoading={patients.isPending}
            isFetching={patients.isPlaceholderData}
            sorting={sorting}
            onSortingChange={onSortingChange}
            renderMobileCard={(patient) => (
              <PatientMobileCard patient={patient} showDoctor={showDoctor} {...actions} />
            )}
            emptyState={
              isFiltered ? (
                <EmptyState
                  icon={SearchX}
                  title="No patients match your filters"
                  description="Try a different search or clear the filters."
                  action={
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      Reset filters
                    </Button>
                  }
                />
              ) : (
                <EmptyState
                  icon={UsersRound}
                  title="No patients yet"
                  description={
                    doctor
                      ? `Dr. ${doctor.name} has no patients yet.`
                      : "Add a patient to get started."
                  }
                  action={
                    canWrite && (
                      <Button size="sm" onClick={openCreate}>
                        <Plus /> Add patient
                      </Button>
                    )
                  }
                />
              )
            }
          />
          <DataTablePagination
            meta={patients.data?.meta}
            noun="patients"
            onPageChange={(page) => setFilters({ page })}
            onLimitChange={(limit) => setFilters({ limit })}
          />
        </div>
      )}

      <PatientFormDialog
        open={form.open}
        patient={form.patient}
        fixedDoctor={doctor}
        onOpenChange={(open) => setForm((current) => ({ ...current, open }))}
      />

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={`Delete ${toDelete?.name ?? "patient"}?`}
        description="This permanently removes the patient and their record. This can't be undone."
        onConfirm={confirmDelete}
      />
    </>
  );
}
