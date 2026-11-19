"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { makeQueryClient } from "@/lib/query-client";

export function Providers({ children }: { children: ReactNode }) {
  // One QueryClient per browser session (useState keeps it stable across renders).
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <NuqsAdapter>
          <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
          <Toaster position="top-right" richColors closeButton />
        </NuqsAdapter>
      </ThemeProvider>
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  );
}
