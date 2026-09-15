"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("light");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read saved theme from localStorage or system preference
    const savedTheme = localStorage.getItem("nahian-theme") as Theme | null;
    const initialTheme: Theme = savedTheme || "light";
    setThemeState(initialTheme);

    const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved =
      initialTheme === "system" ? (isSystemDark ? "dark" : "light") : initialTheme;

    setResolvedTheme(resolved);
    applyThemeClass(resolved);
    setMounted(true);
  }, []);

  const applyThemeClass = (targetTheme: "light" | "dark") => {
    const root = document.documentElement;
    if (targetTheme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("nahian-theme", newTheme);

    let resolved: "light" | "dark" = "light";
    if (newTheme === "system") {
      resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      resolved = newTheme;
    }

    setResolvedTheme(resolved);
    applyThemeClass(resolved);
  };

  const toggleTheme = () => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
