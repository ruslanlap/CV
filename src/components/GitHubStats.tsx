"use client";

import { useTheme } from "@/components/theme-context";
import { useEffect, useState } from "react";

export default function GitHubStats({ username }: { username: string }) {
  const { theme: currentTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const theme = mounted
    ? (currentTheme === "dark" ? "catppuccin_mocha" : "catppuccin_latte")
    : "catppuccin_mocha";

  const stats = `https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&hide_border=true&theme=${theme}`;
  const langs = `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&hide_border=true&theme=${theme}`;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <img
        key={theme} // Force re-render when theme changes
        src={stats}
        alt={`${username} GitHub stats`}
        className="w-full rounded-2xl border border-border bg-mantle transition-opacity duration-300"
        loading="lazy"
      />
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
