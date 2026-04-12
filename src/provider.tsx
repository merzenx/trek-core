import * as React from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ToasterProps } from "sonner";

export type Theme = "dark" | "light" | "system";

type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "trek-core-theme",
    },
  ),
);

export function useTheme() {
  const { theme, setTheme } = useThemeStore();
  const mounted = React.useRef(false);

  React.useEffect(() => {
    mounted.current = true;
  }, []);

  React.useEffect(() => {
    if (!mounted.current) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  return { theme, setTheme };
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}

export function TrekProvider({ children, toastConfig }: { children: React.ReactNode, toastConfig?: ToasterProps }) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        {children}
        <Toaster {...toastConfig} />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export { };
