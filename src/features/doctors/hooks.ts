"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { doctorsApi } from "./api";
import type { DoctorFormValues } from "./schemas";
import type { DoctorFilters } from "./search-params";

export function useDoctors(filters: DoctorFilters) {
  return useQuery({
    queryKey: queryKeys.doctors.list(filters),
    queryFn: ({ signal }) => doctorsApi.list(filters, signal),
    placeholderData: keepPreviousData, // keep showing the old page while the next loads
  });
}

export function useDoctor(id: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.doctors.detail(id ?? ""),
    queryFn: ({ signal }) => doctorsApi.get(id!, signal),
    enabled: Boolean(id),
  });
}

export function useDoctorOptions(search: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.doctors.options(search),
    queryFn: ({ signal }) => doctorsApi.options(search, signal),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    enabled,
  });
}

export function useDoctorFilterOptions() {
  return useQuery({
    queryKey: queryKeys.doctors.filters,
    queryFn: ({ signal }) => doctorsApi.filterOptions(signal),
    staleTime: 5 * 60_000,
  });
}

/** Doctor changes affect lists, details, pickers and dashboard stats. */
function useInvalidateDoctors() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.doctors.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
    ]);
}

export function useCreateDoctor() {
  const invalidate = useInvalidateDoctors();
  return useMutation({ mutationFn: doctorsApi.create, onSuccess: invalidate });
}

export function useUpdateDoctor() {
  const invalidate = useInvalidateDoctors();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<DoctorFormValues> }) =>
      doctorsApi.update(id, values),
    onSuccess: async () => {
      await invalidate();
    },
  });
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateDoctors();
  return useMutation({
    mutationFn: doctorsApi.remove,
    onSuccess: async (_data, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.doctors.detail(id) });
      await invalidate();
    },
  });
}
