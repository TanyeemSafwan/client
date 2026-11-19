/** Mirrors server/src/constants. Labels and badge colors live here (UI only). */

export const SPECIALIZATIONS = [
  "Cardiology",
  "Dermatology",
  "ENT",
  "General Medicine",
  "Gynecology",
  "Neurology",
  "Oncology",
  "Ophthalmology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
] as const;

export const CONDITIONS = [
  "Allergy",
  "Arthritis",
  "Asthma",
  "Covid-19",
  "Depression",
  "Diabetes",
  "Flu",
  "Fracture",
  "Heart Disease",
  "Hypertension",
  "Migraine",
  "Other",
] as const;

export const PATIENT_STATUSES = ["admitted", "under_treatment", "recovered", "discharged"] as const;

export const GENDERS = ["male", "female", "other"] as const;

export type Specialization = (typeof SPECIALIZATIONS)[number];
export type Condition = (typeof CONDITIONS)[number];
export type PatientStatus = (typeof PATIENT_STATUSES)[number];
export type Gender = (typeof GENDERS)[number];

/** Badge colors match the dashboard status chart (same hue per status everywhere). */
export const STATUS_META: Record<PatientStatus, { label: string; className: string }> = {
  admitted: {
    label: "Admitted",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  under_treatment: {
    label: "Under treatment",
    className: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  },
  recovered: {
    label: "Recovered",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  discharged: {
    label: "Discharged",
    className: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  },
};

export const GENDER_LABELS: Record<Gender, string> = {
  male: "Male",
  female: "Female",
  other: "Other",
};

/** Age filter presets → ageMin / ageMax query params. */
export const AGE_GROUPS = [
  { value: "0-17", label: "Children (0–17)", min: 0, max: 17 },
  { value: "18-39", label: "18–39", min: 18, max: 39 },
  { value: "40-64", label: "40–64", min: 40, max: 64 },
  { value: "65-120", label: "65+", min: 65, max: 120 },
] as const;

export const PAGE_SIZES = [10, 20, 50] as const;
