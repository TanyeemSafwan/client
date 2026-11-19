import { api } from "@/lib/api-client";
import type { Paginated } from "@/types/api";
import type {
  Doctor,
  DoctorDetail,
  DoctorFilterOptions,
  DoctorListItem,
  DoctorOption,
} from "@/types/domain";
import type { DoctorFormValues } from "./schemas";
import type { DoctorFilters } from "./search-params";

export const doctorsApi = {
  list: (filters: DoctorFilters, signal?: AbortSignal) =>
    api.get<Paginated<DoctorListItem>>(
      "/doctors",
      {
        page: Math.max(1, filters.page),
        limit: filters.limit,
        search: filters.search,
        specialization: filters.specialization,
        hospital: filters.hospital,
        from: filters.from,
        to: filters.to,
        sort: filters.sort,
        order: filters.order,
      },
      signal,
    ),

  get: (id: string, signal?: AbortSignal) =>
    api.get<{ data: DoctorDetail }>(`/doctors/${id}`, undefined, signal).then((r) => r.data),

  options: (search: string, signal?: AbortSignal) =>
    api.get<{ data: DoctorOption[] }>("/doctors/options", { search }, signal).then((r) => r.data),

  filterOptions: (signal?: AbortSignal) =>
    api
      .get<{ data: DoctorFilterOptions }>("/doctors/filters", undefined, signal)
      .then((r) => r.data),

  create: (values: DoctorFormValues) =>
    api.post<{ data: Doctor }>("/doctors", values).then((r) => r.data),

  update: (id: string, values: Partial<DoctorFormValues>) =>
    api.patch<{ data: Doctor }>(`/doctors/${id}`, values).then((r) => r.data),

  remove: (id: string) => api.delete(`/doctors/${id}`),
};
