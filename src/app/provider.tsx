"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "@/lib/react-query";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors />
    </QueryClientProvider>
  );
}
