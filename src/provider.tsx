import * as React from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ToasterProps } from "sonner";
import tokyoNightTheme from "@/themes/tokyonight";
import gruvboxTheme from "@/themes/gruvbox";

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
  root.classList.remove("light", "dark", "tokyonight");
  root.removeAttribute("style");

  root.classList.add("disable-transitions");

  if (theme === "system" && isInit) {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
    return;
  }

  if (themes[theme]) {
    const themeData = themes[theme];
    for (const [key, value] of Object.entries(themeData.colors)) {
      const colorValue = (value as string).includes("%") ? `hsl(${value})` : value;
      root.style.setProperty(`--${key}`, colorValue as string);
    }
  }

  root.classList.add(theme);

  setTimeout(() => {
    root.classList.remove("disable-transitions");
  }, 0);
};

export function useTheme() {
  const { theme, setTheme } = useThemeStore();
  const mounted = React.useRef(false);

  React.useEffect(() => {
    mounted.current = true;
  }, []);

  React.useEffect(() => {
    if (!mounted.current) return;
    handleTheme(theme);
  }, [theme]);

  return { theme, setTheme };
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();

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
