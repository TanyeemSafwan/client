import { Stethoscope } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 font-semibold tracking-tight ${className ?? ""}`}>
      <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
        <Stethoscope className="size-4" />
      </span>
      Doctor Tracker
    </span>
  );
}
