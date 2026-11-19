import { AGE_GROUPS } from "@/constants/domain";
import { api } from "@/lib/api-client";
import type { Paginated } from "@/types/api";
import type { Patient } from "@/types/domain";
import type { PatientFormValues } from "./schemas";
import type { PatientFilters } from "./search-params";

/** Form values → API body (empty optional fields are omitted). */
function toBody({ email, notes, ...rest }: PatientFormValues) {
  return { ...rest, email: email || "", notes: notes || undefined };
}

export const patientsApi = {
  /** With `doctorId`, lists that doctor's patients via the nested route. */
  list: (filters: PatientFilters, doctorId?: string, signal?: AbortSignal) => {
    const ageGroup = AGE_GROUPS.find((group) => group.value === filters.age);
    return api.get<Paginated<Patient>>(
      doctorId ? `/doctors/${doctorId}/patients` : "/patients",
      {
        page: Math.max(1, filters.page),
        limit: filters.limit,
        search: filters.search,
        condition: filters.condition,
        status: filters.status,
        gender: filters.gender,
        ageMin: ageGroup?.min,
        ageMax: ageGroup?.max,
        doctor: doctorId ? undefined : filters.doctor,
        from: filters.from,
        to: filters.to,
        sort: filters.sort,
        order: filters.order,
      },
      signal,
    );
  },

  create: (values: PatientFormValues) =>
    api.post<{ data: Patient }>("/patients", toBody(values)).then((r) => r.data),

  update: (id: string, values: PatientFormValues) =>
    api.patch<{ data: Patient }>(`/patients/${id}`, toBody(values)).then((r) => r.data),

  remove: (id: string) => api.delete(`/patients/${id}`),
};
