"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 300;

/**
 * Search box that reports its value 300ms after the user stops typing, so we don't fire a
 * request (and a URL update) on every keystroke.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [text, setText] = useState(value);
  const [lastValue, setLastValue] = useState(value);

  // Follow outside changes (e.g. "Reset filters") without an effect.
  if (value !== lastValue) {
    setLastValue(value);
    setText(value);
  }

  useEffect(() => {
    if (text.trim() === value) return;
    const timer = setTimeout(() => onChange(text.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [text, value, onChange]);

  return (
    <div className={cn("relative w-full sm:w-64", className)}>
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
      <Input
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="pr-8 pl-8 [&::-webkit-search-cancel-button]:hidden"
      />
      {text && (
        <button
          type="button"
          onClick={() => {
            setText("");
            onChange("");
          }}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-0.5"
          aria-label="Clear search"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
