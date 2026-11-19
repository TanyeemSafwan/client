"use client";

import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useDoctor, useDoctorOptions } from "./hooks";

/**
 * Searchable doctor select backed by `/doctors/options` (server-side search, 20 results).
 * Shows the selected doctor's name even when it isn't in the current result list.
 */
export function DoctorPicker({
  value,
  onChange,
  placeholder = "Select a doctor…",
  className,
  invalid,
  id,
  initialLabel,
}: {
  value: string;
  onChange: (doctorId: string) => void;
  placeholder?: string;
  className?: string;
  invalid?: boolean;
  id?: string;
  /** Name to show for `value` before it's fetched (e.g. when editing a patient). */
  initialLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  // Remember the name of the doctor we picked, tied to its id (so outside changes don't go stale).
  const [picked, setPicked] = useState(
    value && initialLabel ? { id: value, label: initialLabel } : null,
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(timer);
  }, [search]);

  const options = useDoctorOptions(debouncedSearch, open);
  const knownLabel = picked?.id === value ? picked.label : "";
  // Only fetch the selected doctor if we don't already know their name.
  const selected = useDoctor(value && !knownLabel ? value : null);
  const label = value ? knownLabel || (selected.data ? `Dr. ${selected.data.name}` : "") : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid}
          className={cn(
            "aria-invalid:border-destructive w-full justify-between font-normal",
            !label && "text-muted-foreground",
            className,
          )}
        >
          <span className="truncate">{label || placeholder}</span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) min-w-64 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput value={search} onValueChange={setSearch} placeholder="Search doctors…" />
          <CommandList>
            {options.isFetching && !options.data ? (
              <div className="text-muted-foreground flex items-center justify-center gap-2 py-6 text-sm">
                <Loader2 className="size-4 animate-spin" /> Searching…
              </div>
            ) : (
              <CommandEmpty>No doctors found.</CommandEmpty>
            )}
            <CommandGroup>
              {options.data?.map((doctor) => (
                <CommandItem
                  key={doctor._id}
                  value={doctor._id}
                  onSelect={() => {
                    setPicked({ id: doctor._id, label: `Dr. ${doctor.name}` });
                    onChange(doctor._id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn("size-4", value === doctor._id ? "opacity-100" : "opacity-0")}
                  />
                  <span className="min-w-0">
                    <span className="block truncate">Dr. {doctor.name}</span>
                    <span className="text-muted-foreground block truncate text-xs">
                      {doctor.specialization} · {doctor.hospital}
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
