"use client";

import { useTheme } from "@/components/theme-context";
import { useEffect, useState } from "react";

export default function GitHubStats({ username }: { username: string }) {
  const { theme: currentTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const isDark = currentTheme === "dark";
  const theme = mounted
    ? (isDark ? "catppuccin_mocha" : "catppuccin_latte")
    : "catppuccin_mocha";

  // Match the accent colors from globals.css
  const titleColor = isDark ? "a5cf88" : "a166f1";
  const iconColor = titleColor;
  const textColor = isDark ? "cdd6f4" : "1a1a1a";

  const stats = `https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&hide_border=true&theme=${theme}&title_color=${titleColor}&icon_color=${iconColor}&text_color=${textColor}`;
  const langs = `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&hide_border=true&theme=${theme}&title_color=${titleColor}`;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={theme} // Force re-render when theme changes
        src={stats}
        alt={`${username} GitHub stats`}
        className="w-full rounded-2xl border border-border bg-mantle transition-opacity duration-300"
        loading="lazy"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={`${theme}-lang`}
        src={langs}
        alt={`${username} top languages`}
        className="w-full rounded-2xl border border-border bg-mantle transition-opacity duration-300"
        loading="lazy"
      />
    </div>
  );
}
