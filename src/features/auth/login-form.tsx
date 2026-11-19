"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, ShieldCheck, UserRound } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api-client";
import { useLogin } from "./hooks";

const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

const DEMO_ACCOUNTS = [
  {
    label: "Admin",
    description: "Full access",
    icon: ShieldCheck,
    email: "admin@doctortracker.dev",
    password: "Admin@12345",
  },
  {
    label: "Viewer",
    description: "Read-only",
    icon: UserRound,
    email: "viewer@doctortracker.dev",
    password: "Viewer@12345",
  },
];

export function LoginForm() {
  const searchParams = useSearchParams();
  const login = useLogin(searchParams.get("next"));
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((values) => login.mutate(values));

  const serverError =
    login.error instanceof ApiError
      ? login.error.message
      : login.error
        ? "Could not reach the server. Please try again."
        : null;

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@hospital.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...form.register("email")}
          />
          {errors.email && (
            <p id="email-error" className="text-destructive text-sm">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className="pr-10"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...form.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex w-10 items-center justify-center"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="text-destructive text-sm">
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && (
          <p
            role="alert"
            className="border-destructive/30 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm"
          >
            {serverError}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending && <Loader2 className="animate-spin" />}
          {login.isPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="space-y-3">
        <div className="text-muted-foreground flex items-center gap-3 text-xs uppercase">
          <span className="bg-border h-px flex-1" />
          Demo accounts
          <span className="bg-border h-px flex-1" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {DEMO_ACCOUNTS.map(({ label, description, icon: Icon, email, password }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                form.setValue("email", email, { shouldValidate: true });
                form.setValue("password", password, { shouldValidate: true });
              }}
              className="hover:bg-accent flex items-center gap-3 rounded-lg border p-3 text-left transition-colors"
            >
              <Icon className="text-primary size-5 shrink-0" />
              <span>
                <span className="block text-sm font-medium">{label}</span>
                <span className="text-muted-foreground block text-xs">{description}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
