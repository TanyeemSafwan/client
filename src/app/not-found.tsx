import { FileQuestion } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <span className="bg-muted flex size-14 items-center justify-center rounded-full">
        <FileQuestion className="text-muted-foreground size-7" />
      </span>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground text-sm">
          The page you&apos;re looking for doesn&apos;t exist or was moved.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </main>
  );
}
