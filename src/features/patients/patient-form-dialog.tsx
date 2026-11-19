"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";
import { Controller, useForm, type Control, type FieldPath } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CONDITIONS,
  GENDER_LABELS,
  GENDERS,
  PATIENT_STATUSES,
  STATUS_META,
} from "@/constants/domain";
import { DoctorPicker } from "@/features/doctors/doctor-picker";
import { applyServerErrors } from "@/lib/form-errors";
import type { Patient } from "@/types/domain";
import { useCreatePatient, useUpdatePatient } from "./hooks";
import {
  PATIENT_FORM_FIELDS,
  patientFormSchema,
  type PatientFormInput,
  type PatientFormValues,
} from "./schemas";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present → edit mode. */
  patient?: Patient | null;
  /** Adding from a doctor's page: doctor is pre-selected and can't be changed. */
  fixedDoctor?: { _id: string; name: string } | null;
};

export function PatientFormDialog({ open, onOpenChange, patient, fixedDoctor }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{patient ? "Edit patient" : "Add patient"}</DialogTitle>
          <DialogDescription>
            {fixedDoctor && !patient
              ? `New patient under Dr. ${fixedDoctor.name}.`
              : patient
                ? "Update the patient's details, status or assigned doctor."
                : "Register a new patient and assign them to a doctor."}
          </DialogDescription>
        </DialogHeader>
        <PatientForm
          key={patient?._id ?? "new"}
          patient={patient}
          fixedDoctor={fixedDoctor}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function EnumSelect<T extends string>({
  control,
  name,
  id,
  options,
  labelFor = (value) => value,
  invalid,
}: {
  control: Control<PatientFormInput, unknown, PatientFormValues>;
  name: FieldPath<PatientFormInput>;
  id: string;
  options: readonly T[];
  labelFor?: (value: T) => string;
  invalid: boolean;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select value={(field.value as string) ?? ""} onValueChange={field.onChange}>
          <SelectTrigger id={id} className="w-full" aria-invalid={invalid} onBlur={field.onBlur}>
            <SelectValue placeholder="Select…" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {labelFor(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}

function PatientForm({
  patient,
  fixedDoctor,
  onDone,
}: {
  patient?: Patient | null;
  fixedDoctor?: { _id: string; name: string } | null;
  onDone: () => void;
}) {
  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();
  const isPending = createPatient.isPending || updatePatient.isPending;

  // This form only mounts when the dialog opens (client-side), so "today" here is safe.
  const today = format(new Date(), "yyyy-MM-dd");

  const form = useForm<PatientFormInput, unknown, PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: patient?.name ?? "",
      age: patient?.age ?? "",
      gender: patient?.gender,
      phone: patient?.phone ?? "",
      email: patient?.email ?? "",
      condition: patient?.condition,
      status: patient?.status ?? "admitted",
      admissionDate: patient ? format(parseISO(patient.admissionDate), "yyyy-MM-dd") : today,
      doctor: patient?.doctor?._id ?? fixedDoctor?._id ?? "",
      notes: patient?.notes ?? "",
    },
  });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((values) => {
    const options = {
      onSuccess: () => {
        toast.success(patient ? "Patient updated" : `${values.name} added`);
        onDone();
      },
      onError: (error: unknown) => applyServerErrors(error, form.setError, PATIENT_FORM_FIELDS),
    };
    if (patient) updatePatient.mutate({ id: patient._id, values }, options);
    else createPatient.mutate(values, options);
  });

  const showDoctorPicker = !fixedDoctor || Boolean(patient);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <FieldGroup className="gap-4">
        <div className="grid gap-4 sm:grid-cols-[1fr_7rem_9rem]">
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="patient-name">Full name</FieldLabel>
            <Input
              id="patient-name"
              placeholder="Alex Johnson"
              aria-invalid={!!errors.name}
              {...form.register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>
          <Field data-invalid={!!errors.age}>
            <FieldLabel htmlFor="patient-age">Age</FieldLabel>
            <Input
              id="patient-age"
              type="number"
              inputMode="numeric"
              min={0}
              max={120}
              aria-invalid={!!errors.age}
              {...form.register("age")}
            />
            <FieldError errors={[errors.age]} />
          </Field>
          <Field data-invalid={!!errors.gender}>
            <FieldLabel htmlFor="patient-gender">Gender</FieldLabel>
            <EnumSelect
              control={form.control}
              name="gender"
              id="patient-gender"
              options={GENDERS}
              labelFor={(g) => GENDER_LABELS[g]}
              invalid={!!errors.gender}
            />
            <FieldError errors={[errors.gender]} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.phone}>
            <FieldLabel htmlFor="patient-phone">Phone</FieldLabel>
            <Input
              id="patient-phone"
              type="tel"
              placeholder="+1 555 987 6543"
              aria-invalid={!!errors.phone}
              {...form.register("phone")}
            />
            <FieldError errors={[errors.phone]} />
          </Field>
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="patient-email">
              Email <span className="text-muted-foreground font-normal">(optional)</span>
            </FieldLabel>
            <Input
              id="patient-email"
              type="email"
              placeholder="alex@example.com"
              aria-invalid={!!errors.email}
              {...form.register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field data-invalid={!!errors.condition}>
            <FieldLabel htmlFor="patient-condition">Condition</FieldLabel>
            <EnumSelect
              control={form.control}
              name="condition"
              id="patient-condition"
              options={CONDITIONS}
              invalid={!!errors.condition}
            />
            <FieldError errors={[errors.condition]} />
          </Field>
          <Field data-invalid={!!errors.status}>
            <FieldLabel htmlFor="patient-status">Status</FieldLabel>
            <EnumSelect
              control={form.control}
              name="status"
              id="patient-status"
              options={PATIENT_STATUSES}
              labelFor={(s) => STATUS_META[s].label}
              invalid={!!errors.status}
            />
            <FieldError errors={[errors.status]} />
          </Field>
          <Field data-invalid={!!errors.admissionDate}>
            <FieldLabel htmlFor="patient-admission">Admitted on</FieldLabel>
            <Input
              id="patient-admission"
              type="date"
              max={today}
              aria-invalid={!!errors.admissionDate}
              {...form.register("admissionDate")}
            />
            <FieldError errors={[errors.admissionDate]} />
          </Field>
        </div>

        {showDoctorPicker && (
          <Field data-invalid={!!errors.doctor}>
            <FieldLabel htmlFor="patient-doctor">Doctor</FieldLabel>
            <Controller
              control={form.control}
              name="doctor"
              render={({ field }) => (
                <DoctorPicker
                  id="patient-doctor"
                  value={field.value}
                  onChange={field.onChange}
                  invalid={!!errors.doctor}
                  initialLabel={
                    patient?.doctor
                      ? `Dr. ${patient.doctor.name}`
                      : fixedDoctor
                        ? `Dr. ${fixedDoctor.name}`
                        : undefined
                  }
                />
              )}
            />
            <FieldError errors={[errors.doctor]} />
          </Field>
        )}

        <Field data-invalid={!!errors.notes}>
          <FieldLabel htmlFor="patient-notes">
            Notes <span className="text-muted-foreground font-normal">(optional)</span>
          </FieldLabel>
          <Textarea
            id="patient-notes"
            rows={3}
            placeholder="Follow-up in two weeks…"
            aria-invalid={!!errors.notes}
            {...form.register("notes")}
          />
          <FieldError errors={[errors.notes]} />
        </Field>
      </FieldGroup>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          {patient ? "Save changes" : "Add patient"}
        </Button>
      </DialogFooter>
    </form>
  );
}
