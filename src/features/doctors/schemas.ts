import { z } from "zod";
import { SPECIALIZATIONS } from "@/constants/domain";

/** Mirrors server createDoctorBody so users get instant feedback. */
export const doctorFormSchema = z.object({
  // Shown as "Dr. <name>" everywhere, so a typed "Dr." prefix is dropped.
  name: z
    .string()
    .trim()
    .transform((v) => v.replace(/^dr\.?\s+/i, ""))
    .pipe(z.string().min(2, "Name is too short").max(100)),
  specialization: z.enum(SPECIALIZATIONS, "Choose a specialization"),
  hospital: z.string().trim().min(2, "Hospital is required").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s()-]{7,20}$/, "Enter a valid phone number"),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email")),
});

export type DoctorFormValues = z.infer<typeof doctorFormSchema>;
export type DoctorFormInput = z.input<typeof doctorFormSchema>;

export const DOCTOR_FORM_FIELDS = ["name", "specialization", "hospital", "phone", "email"] as const;
