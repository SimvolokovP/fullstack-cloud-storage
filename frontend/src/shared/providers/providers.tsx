"use client";

import { PropsWithChildren } from "react";
import { QueryClientAppProvider } from "./query-client-app-provider";
import { ThemeProvider } from "./theme-provider";
import { SonnerToasterProvider } from "./sonner-toaster-provider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientAppProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
      <SonnerToasterProvider />
    </QueryClientAppProvider>
  );
}
