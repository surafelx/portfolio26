"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner
          theme="dark"
          toastOptions={{
            style: {
              background: "hsl(220 13% 13%)",
              border: "1px solid hsl(120 30% 25%)",
              color: "hsl(220 15% 85%)",
            },
          }}
        />
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  );
}