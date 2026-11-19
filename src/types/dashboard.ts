import type { Gender, PatientStatus, Specialization } from "@/constants/domain";

export type Granularity = "day" | "week" | "month";

type Range = { from: string; to: string };

export type DashboardSummary = {
  range: Range;
  totalDoctors: number;
  totalPatients: number;
  activePatients: number;
  avgPatientsPerDoctor: number;
  newPatients: { current: number; previous: number; changePct: number | null };
  newDoctors: { current: number; previous: number; changePct: number | null };
};

export type DashboardTrends = {
  range: Range;
  granularity: Granularity;
  points: Array<{ date: string; count: number }>;
};

export type TopDoctor = {
  doctorId: string;
  name: string;
  specialization: Specialization;
  count: number;
};

export type Breakdown<K extends string = string> = Array<{ key: K; count: number }>;

export type DashboardDistribution = {
  range: Range;
  byCondition: Breakdown;
  byStatus: Breakdown<PatientStatus>;
  byGender: Breakdown<Gender>;
  bySpecialization: Breakdown<Specialization>;
};
