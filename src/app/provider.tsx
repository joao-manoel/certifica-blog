"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "@/lib/react-query";
import { UtmTracker } from "@/components/utm-tracker";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors />
      <SpeedInsights />
      <UtmTracker />
    </QueryClientProvider>
  );
}
