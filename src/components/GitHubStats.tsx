"use client";

import { useTheme } from "@/components/theme-context";
import { useEffect, useState } from "react";
import Image from "next/image";

// Use your own Vercel deployment of github-readme-stats
// Deploy your own: https://github.com/anuraghazra/github-readme-stats#deploy-on-your-own
// IMPORTANT: Set PAT_1 env var in your Vercel deployment to avoid rate limiting
const STATS_BASE_URL = process.env.NEXT_PUBLIC_GITHUB_STATS_URL || "https://github-stats-deploy-theta.vercel.app";

export default function GitHubStats({ username }: { username: string }) {
  const { theme: currentTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [statsError, setStatsError] = useState(false);
  const [langsError, setLangsError] = useState(false);
  const [serviceAvailable, setServiceAvailable] = useState(true);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  // Pre-check: fetch the SVG and detect error content before rendering
  useEffect(() => {
    const checkService = async () => {
      try {
        const res = await fetch(
          `${STATS_BASE_URL}/api?username=${username}&show_icons=true`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          setServiceAvailable(false);
          return;
        }
        const text = await res.text();
        // The service returns SVGs with "Something went wrong" on rate limit
        if (text.includes("Something went wrong") || text.includes("rate limit")) {
          setServiceAvailable(false);
        }
      } catch {
        setServiceAvailable(false);
      }
    };
    checkService();
  }, [username]);

  const isDark = currentTheme === "dark";
  const theme = mounted
    ? (isDark ? "catppuccin_mocha" : "catppuccin_latte")
    : "catppuccin_mocha";

  // Match the accent colors from globals.css
  const titleColor = isDark ? "a5cf88" : "a166f1";
  const iconColor = titleColor;
  const textColor = isDark ? "cdd6f4" : "1a1a1a";

  const stats = `${STATS_BASE_URL}/api?username=${username}&show_icons=true&hide_border=true&include_all_commits=true&theme=${theme}&title_color=${titleColor}&icon_color=${iconColor}&text_color=${textColor}`;
  const langs = `${STATS_BASE_URL}/api/top-langs/?username=${username}&layout=compact&hide_border=true&theme=${theme}&title_color=${titleColor}&icon_color=${iconColor}&text_color=${textColor}&langs_count=5&card_width=400`;

  // If service is unavailable (rate limited), throw to trigger ErrorBoundary
  if (!serviceAvailable) {
    throw new Error("GitHub readme stats service is rate limited");
  }

  const ErrorFallback = ({ message }: { message: string }) => (
    <div className="w-full h-[195px] rounded-2xl border border-border bg-mantle flex items-center justify-center p-6">
      <div className="text-center text-subtext0">
        <p className="text-sm">{message}</p>
        <p className="text-xs mt-2 opacity-70">Service temporarily unavailable</p>
      </div>
    </div>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {!statsError ? (
        <Image
          key={theme}
          src={stats}
          alt={`${username} GitHub stats`}
          width={495}
          height={195}
          loading="lazy"
          className="w-full h-auto rounded-2xl border border-border bg-mantle transition-opacity duration-300"
          onError={() => setStatsError(true)}
        />
      ) : (
        <ErrorFallback message="GitHub stats unavailable" />
      )}

      {!langsError ? (
        <Image
          key={`${theme}-lang`}
          src={langs}
          alt={`${username} top languages`}
          width={400}
          height={195}
          loading="lazy"
          className="w-full h-auto rounded-2xl border border-border bg-mantle transition-opacity duration-300"
          onError={() => setLangsError(true)}
        />
      ) : (
        <ErrorFallback message="Language stats unavailable" />
      )}
    </div>
  );
}
