"use client";

import { ThemeProvider as NextThemes } from "next-themes";

export function ThemeProvider({
  children,
  defaultTheme,
}: {
  children: React.ReactNode;
  defaultTheme: "system" | "light" | "dark";
}) {
  return (
    <NextThemes attribute="data-theme" defaultTheme={defaultTheme} enableSystem storageKey="surafel-theme" disableTransitionOnChange>
      {children}
    </NextThemes>
  );
}
