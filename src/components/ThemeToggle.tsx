"use client";

import { useTheme } from "@/components/theme-context";

export default function ThemeToggle({ variant }: { variant?: "default" | "nav" }) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-lg transition-colors text-sm font-medium";
  const navStyles = "px-2 py-1.5 sm:px-3 sm:py-2 text-subtext hover:bg-surface/50 hover:text-text";
  const defaultStyles = "border border-border bg-mantle px-2 py-1.5 sm:px-3 sm:py-2 hover:bg-surface/60 hover:text-text min-w-[2.5rem] sm:min-w-[5.5rem]";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`group ${baseStyles} ${variant === "nav" ? navStyles : defaultStyles} gap-0 hover:gap-2`}
      aria-label="Toggle theme"
    >
      <span className="shrink-0 text-subtext">{isDark ? "🌙" : "☀️"}</span>
      {variant === "nav" && (
        <span className="hidden sm:block max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 ease-in-out">
          {isDark ? "Dark" : "Light"}
        </span>
      )}
    </button>
  );
}
