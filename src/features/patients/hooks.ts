"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import type { Paginated } from "@/types/api";
import type { Patient } from "@/types/domain";
import { patientsApi } from "./api";
import type { PatientFormValues } from "./schemas";
import type { PatientFilters } from "./search-params";

export function usePatients(filters: PatientFilters, doctorId?: string) {
  return useQuery({
    // Doctor-scoped lists live under the same "patients" key so mutations refresh them too.
    queryKey: queryKeys.patients.list({ ...filters, scopeDoctor: doctorId ?? null }),
    queryFn: ({ signal }) => patientsApi.list(filters, doctorId, signal),
    placeholderData: keepPreviousData,
  });
}

/** Patient changes affect patient lists, doctor patient counts and dashboard stats. */
function useInvalidateAfterPatientChange() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.doctors.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
    ]);
}

export function useCreatePatient() {
  const invalidate = useInvalidateAfterPatientChange();
  return useMutation({ mutationFn: patientsApi.create, onSuccess: invalidate });
}

export function useUpdatePatient() {
  const invalidate = useInvalidateAfterPatientChange();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: PatientFormValues }) =>
      patientsApi.update(id, values),
    onSuccess: async () => {
      await invalidate();
    },
  });
}

/** Optimistic: the row disappears immediately and comes back if the server refuses. */
export function useDeletePatient() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateAfterPatientChange();
  const listKey = [...queryKeys.patients.all, "list"];

  return useMutation({
    mutationFn: patientsApi.remove,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const snapshots = queryClient.getQueriesData<Paginated<Patient>>({ queryKey: listKey });
      queryClient.setQueriesData<Paginated<Patient>>({ queryKey: listKey }, (old) =>
        old
          ? {
              data: old.data.filter((patient) => patient._id !== id),
              meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) },
            }
          : old,
      );
      return { snapshots };
    },
    onError: (_error, _id, context) => {
      context?.snapshots.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSettled: invalidate,
  });
}
