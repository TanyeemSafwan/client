import type { Condition, Gender, PatientStatus, Specialization } from "@/constants/domain";

export type Doctor = {
  _id: string;
  name: string;
  specialization: Specialization;
  hospital: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type DoctorListItem = Doctor & { patientCount: number };

export type DoctorDetail = Doctor & {
  patientCount: number;
  patientsByStatus: Partial<Record<PatientStatus, number>>;
};

export type DoctorOption = Pick<Doctor, "_id" | "name" | "specialization" | "hospital">;

export type DoctorFilterOptions = { specializations: Specialization[]; hospitals: string[] };

export type Patient = {
  _id: string;
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  email?: string;
  condition: Condition;
  status: PatientStatus;
  admissionDate: string;
  doctor: DoctorOption | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
