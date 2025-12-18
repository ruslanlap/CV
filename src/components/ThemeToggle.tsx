"use client";

import { useTheme } from "@/components/theme-context";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-mantle px-3 py-2 text-sm font-medium hover:bg-surface/60 transition min-w-[5.5rem]"
      aria-label="Toggle theme"
    >
      <span className="font-medium">{isDark ? "Dark" : "Light"}</span>
      <span className="text-subtext">{isDark ? "🌙" : "☀️"}</span>
    </button>
  );
}
