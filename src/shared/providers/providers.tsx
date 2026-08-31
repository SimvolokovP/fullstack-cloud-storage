"use client";

import { PropsWithChildren } from "react";
import { QueryClientAppProvider } from "./query-client-app-provider";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientAppProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </QueryClientAppProvider>
  );
}
