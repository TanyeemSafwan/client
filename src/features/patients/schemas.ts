import { z } from "zod";
import { CONDITIONS, GENDERS, PATIENT_STATUSES } from "@/constants/domain";

/** Mirrors the server patient schema. `doctor` is required unless fixed by the page. */
export const patientFormSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(100),
  age: z.coerce
    .number<string | number>("Enter an age")
    .int("Age must be a whole number")
    .min(0, "Age must be 0 or more")
    .max(120, "Age must be 120 or less"),
  gender: z.enum(GENDERS, "Choose a gender"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s()-]{7,20}$/, "Enter a valid phone number"),
  email: z.union([
    z.literal(""),
    z.string().trim().toLowerCase().pipe(z.email("Enter a valid email")),
  ]),
  condition: z.enum(CONDITIONS, "Choose a condition"),
  status: z.enum(PATIENT_STATUSES),
  admissionDate: z.string().min(1, "Choose an admission date"),
  doctor: z.string().min(1, "Choose a doctor"),
  notes: z.string().trim().max(1000, "Keep notes under 1000 characters"),
});

export type PatientFormInput = z.input<typeof patientFormSchema>;
export type PatientFormValues = z.output<typeof patientFormSchema>;

export const PATIENT_FORM_FIELDS = [
  "name",
  "age",
  "gender",
  "phone",
  "email",
  "condition",
  "status",
  "admissionDate",
  "doctor",
  "notes",
] as const;
