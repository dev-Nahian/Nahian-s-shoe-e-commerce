"use client";

import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse ${className}`} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative p-2 rounded-full border transition-all cursor-pointer ${
        isDark
          ? "bg-gray-900 border-gray-800 text-amber-300 hover:bg-gray-800 hover:border-gray-700 shadow-sm"
          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 shadow-xs"
      } ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <Sun
          className={`w-4 h-4 transition-all duration-300 absolute ${
            isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
          }`}
        />
        <Moon
          className={`w-4 h-4 transition-all duration-300 absolute ${
            isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
          }`}
        />
      </div>
    </button>
  );
}
