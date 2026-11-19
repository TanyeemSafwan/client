import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <span className="bg-muted flex size-12 items-center justify-center rounded-full">
        <Icon className="text-muted-foreground size-6" />
      </span>
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}
