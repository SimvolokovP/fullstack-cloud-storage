"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "@/shared/ui/sonner";

export function SonnerToasterProvider() {
  const { theme } = useTheme();

  const currentTheme =
    theme === "system" || theme === "dark" || theme === "light"
      ? theme
      : "system";

  return (
    <SonnerToaster theme={currentTheme || "system"} position="top-right" />
  );
}
