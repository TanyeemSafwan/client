"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
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
import { SPECIALIZATIONS } from "@/constants/domain";
import { applyServerErrors } from "@/lib/form-errors";
import type { Doctor } from "@/types/domain";
import { useCreateDoctor, useDoctorFilterOptions, useUpdateDoctor } from "./hooks";
import {
  DOCTOR_FORM_FIELDS,
  doctorFormSchema,
  type DoctorFormInput,
  type DoctorFormValues,
} from "./schemas";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present → edit mode. */
  doctor?: Doctor | null;
};

export function DoctorFormDialog({ open, onOpenChange, doctor }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{doctor ? "Edit doctor" : "Add doctor"}</DialogTitle>
          <DialogDescription>
            {doctor
              ? "Update this doctor's profile and contact details."
              : "Register a new doctor. You can add their patients afterwards."}
          </DialogDescription>
        </DialogHeader>
        {/* key: a fresh form (and default values) for each doctor / each open */}
        <DoctorForm key={doctor?._id ?? "new"} doctor={doctor} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function DoctorForm({ doctor, onDone }: { doctor?: Doctor | null; onDone: () => void }) {
  const createDoctor = useCreateDoctor();
  const updateDoctor = useUpdateDoctor();
  const { data: filterOptions } = useDoctorFilterOptions();
  const isPending = createDoctor.isPending || updateDoctor.isPending;

  const form = useForm<DoctorFormInput, unknown, DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: doctor?.name ?? "",
      specialization: doctor?.specialization,
      hospital: doctor?.hospital ?? "",
      phone: doctor?.phone ?? "",
      email: doctor?.email ?? "",
    },
  });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((values) => {
    const options = {
      onSuccess: () => {
        toast.success(doctor ? "Doctor updated" : `Dr. ${values.name} added`);
        onDone();
      },
      onError: (error: unknown) => applyServerErrors(error, form.setError, DOCTOR_FORM_FIELDS),
    };
    if (doctor) updateDoctor.mutate({ id: doctor._id, values }, options);
    else createDoctor.mutate(values, options);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <FieldGroup className="gap-4">
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="doctor-name">Full name</FieldLabel>
          <Input
            id="doctor-name"
            placeholder="Jane Smith"
            aria-invalid={!!errors.name}
            {...form.register("name")}
          />
          <FieldError errors={[errors.name]} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.specialization}>
            <FieldLabel htmlFor="doctor-specialization">Specialization</FieldLabel>
            <Controller
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="doctor-specialization"
                    className="w-full"
                    aria-invalid={!!errors.specialization}
                    onBlur={field.onBlur}
                  >
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALIZATIONS.map((specialization) => (
                      <SelectItem key={specialization} value={specialization}>
                        {specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.specialization]} />
          </Field>

          <Field data-invalid={!!errors.hospital}>
            <FieldLabel htmlFor="doctor-hospital">Hospital</FieldLabel>
            <Input
              id="doctor-hospital"
              list="hospital-suggestions"
              placeholder="City General Hospital"
              aria-invalid={!!errors.hospital}
              {...form.register("hospital")}
            />
            <datalist id="hospital-suggestions">
              {filterOptions?.hospitals.map((hospital) => (
                <option key={hospital} value={hospital} />
              ))}
            </datalist>
            <FieldError errors={[errors.hospital]} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="doctor-email">Email</FieldLabel>
            <Input
              id="doctor-email"
              type="email"
              placeholder="jane.smith@hospital.com"
              aria-invalid={!!errors.email}
              {...form.register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>

          <Field data-invalid={!!errors.phone}>
            <FieldLabel htmlFor="doctor-phone">Phone</FieldLabel>
            <Input
              id="doctor-phone"
              type="tel"
              placeholder="+1 555 123 4567"
              aria-invalid={!!errors.phone}
              {...form.register("phone")}
            />
            <FieldError errors={[errors.phone]} />
          </Field>
        </div>
      </FieldGroup>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          {doctor ? "Save changes" : "Add doctor"}
        </Button>
      </DialogFooter>
    </form>
  );
}
