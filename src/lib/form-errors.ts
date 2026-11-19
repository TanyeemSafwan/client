import { toast } from "sonner";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ApiError } from "./api-client";

/**
 * Shows server validation/conflict errors under the matching form fields
 * (e.g. 409 "This email is already in use"); anything else becomes a toast.
 */
export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly Path<T>[],
) {
  if (error instanceof ApiError && error.details) {
    let matched = false;
    for (const [field, messages] of Object.entries(error.details)) {
      if ((fields as readonly string[]).includes(field) && messages[0]) {
        setError(field as Path<T>, { type: "server", message: messages[0] });
        matched = true;
      }
    }
    if (matched) return;
  }
  toast.error(
    error instanceof ApiError ? error.message : "Something went wrong. Please try again.",
  );
}

export function errorMessage(error: unknown) {
  return error instanceof ApiError ? error.message : "Something went wrong. Please try again.";
}
