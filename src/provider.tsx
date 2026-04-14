import * as React from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ToasterProps } from "sonner";
import tokyoNightTheme from "@/themes/tokyonight";
import gruvboxTheme from "@/themes/gruvbox";
import { useNUI, useNUIEvent } from "./api";

interface ThemeConfig {
  name: string;
  id: string;
  colors: Record<string, string>;
}

const themes: Record<string, ThemeConfig> = {
  tokyonight: tokyoNightTheme as ThemeConfig,
  gruvbox: gruvboxTheme as ThemeConfig,
};

export enum Theme {
  Dark = "dark",
  Light = "light",
  System = "system",
  TokyoNight = "tokyonight",
  Gruvbox = "gruvbox",
}

type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: Theme.TokyoNight,
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "trek-core-theme",
    },
  ),
);

const handleTheme = (theme: Theme, isInit: boolean = false) => {
  const root = window.document.documentElement;

  root.classList.add("disable-transitions");

  root.classList.remove("light", "dark", "tokyonight", "gruvbox");
  root.removeAttribute("style");

  if (theme === "system" && isInit) {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
    return;
  }

  //TODO: handle custom themes object save to localStorage.

  if (theme === "system" && isInit) {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
  } else {
    if (themes[theme]) {
      const themeData = themes[theme];
      for (const [key, value] of Object.entries(themeData.colors)) {
        const colorValue = (value as string).includes("%") ? `hsl(${value})` : value;
        root.style.setProperty(`--${key}`, colorValue as string);
      }
    }
    root.classList.add(theme);
  }
  // force reflow
  window.getComputedStyle(root).opacity;
  root.classList.remove("disable-transitions");
};

export function useTheme() {
  const { theme, setTheme } = useThemeStore();
  const mounted = React.useRef(false);
  // const { query } = useNUI("theme:set", { lazy: true });

  React.useEffect(() => {
    mounted.current = true;
  }, []);

  // TODO: Handle body passing theme objects instead of theme name. prevent syntax version missing

  // React.useEffect(() => {
  //   if (!mounted.current) return;
  //   query({ body: { theme } });
  //   handleTheme(theme);
  // }, [theme]);

  return { theme, setTheme };
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();
  // useNUIEvent("theme:set", (data) => {
  //   handleTheme(data.theme);
  // });

  React.useEffect(() => {
    handleTheme(theme, true);
  }, [theme]);

  return <>{children}</>;
}

export function TrekProvider({
  children,
  toastConfig,
}: {
  children: React.ReactNode;
  toastConfig?: ToasterProps;
}) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        {children}
        <Toaster {...toastConfig} />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export {};
