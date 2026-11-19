import { Activity, ChartColumn, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Logo } from "@/components/layout/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

const HIGHLIGHTS = [
  { icon: Activity, text: "Track doctors and their patients in one place" },
  { icon: ChartColumn, text: "Live analytics on intake, workload and conditions" },
  { icon: ShieldCheck, text: "Secure, role-based access for your team" },
];

function LoginFormSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-9 w-full" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <section className="from-brand text-brand-foreground relative hidden overflow-hidden bg-linear-to-br to-[oklch(0.34_0.07_215)] p-10 lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-black/10 blur-3xl"
        />
        <Logo className="relative [&>span]:bg-white/15" />
        <div className="relative max-w-md space-y-6">
          <h1 className="text-4xl leading-tight font-semibold tracking-tight">
            Care runs smoother when you can see the whole picture.
          </h1>
          <ul className="space-y-3">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm/6 opacity-90">
                <Icon className="size-5 shrink-0" />
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs opacity-70">© 2026 Doctor Tracker</p>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm space-y-8">
          <Logo className="lg:hidden" />
          <div className="space-y-1.5">
            <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground text-sm">Sign in to manage doctors and patients.</p>
          </div>
          {/* LoginForm reads ?next= from the URL, which needs a Suspense boundary. */}
          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
