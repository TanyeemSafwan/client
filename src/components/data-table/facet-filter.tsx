"use client";

import { Check, CirclePlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type FacetOption<T extends string = string> = { value: T; label: string };

/**
 * Filter button with a searchable option list. Multi-select by default;
 * `single` makes it pick one value (clicking the selected one clears it).
 */
export function FacetFilter<T extends string>({
  title,
  options,
  selected,
  onChange,
  single = false,
}: {
  title: string;
  options: readonly FacetOption<T>[];
  selected: readonly T[];
  onChange: (values: T[]) => void;
  single?: boolean;
}) {
  const selectedSet = new Set(selected);
  const labelFor = (value: T) => options.find((o) => o.value === value)?.label ?? value;

  const toggle = (value: T) => {
    if (single) return onChange(selectedSet.has(value) ? [] : [value]);
    const next = new Set(selectedSet);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    // Keep option order stable in the URL.
    onChange(options.map((o) => o.value).filter((v) => next.has(v)));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="border-dashed">
          <CirclePlus />
          {title}
          {selected.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-4" />
              {selected.length > 2 ? (
                <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                  {selected.length} selected
                </Badge>
              ) : (
                selected.map((value) => (
                  <Badge key={value} variant="secondary" className="rounded-sm px-1 font-normal">
                    {labelFor(value)}
                  </Badge>
                ))
              )}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0" align="start">
        <Command>
          {options.length > 6 && <CommandInput placeholder={title} />}
          <CommandList>
            <CommandEmpty>No matches.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedSet.has(option.value);
                return (
                  <CommandItem key={option.value} onSelect={() => toggle(option.value)}>
                    <span
                      className={cn(
                        "border-primary flex size-4 items-center justify-center border",
                        single ? "rounded-full" : "rounded-sm",
                        isSelected ? "bg-primary text-primary-foreground" : "opacity-50",
                      )}
                    >
                      {isSelected && <Check className="size-3" />}
                    </span>
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selected.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={() => onChange([])} className="justify-center">
                    Clear filter
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
