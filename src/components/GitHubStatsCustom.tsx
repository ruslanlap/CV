"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-context";

interface GitHubStats {
    publicRepos: number;
    followers: number;
    totalStars: number;
    totalForks: number;
}

interface Language {
    name: string;
    bytes: number;
}

const LANG_COLORS: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
    Vue: "#41b883",
    Go: "#00ADD8",
    Rust: "#dea584",
};

export default function GitHubStatsCustom({ username }: { username: string }) {
    const { theme: currentTheme } = useTheme();
    const [stats, setStats] = useState<GitHubStats | null>(null);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, langsRes] = await Promise.all([
                    fetch(`/api/github-stats?username=${username}&type=stats`),
                    fetch(`/api/github-stats?username=${username}&type=langs`),
                ]);
                if (!statsRes.ok || !langsRes.ok) throw new Error("Failed");
                const statsData = await statsRes.json();
                const langsData = await langsRes.json();
                setStats(statsData);
                setLanguages(langsData.languages || []);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [username]);

    const isDark = currentTheme === "dark";
    const accent = isDark ? "#a5cf88" : "#a166f1";
    const textCol = isDark ? "#cdd6f4" : "#1a1a1a";
    const subtext = isDark ? "#a6adc8" : "#6c6f85";
    const bg = isDark ? "#1e1e2e" : "#eff1f5";

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2">
                <div className="h-[200px] animate-pulse rounded-2xl border border-border bg-mantle" />
                <div className="h-[200px] animate-pulse rounded-2xl border border-border bg-mantle" />
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="rounded-2xl border border-border bg-mantle p-6 text-center">
                <p className="text-subtext0">GitHub stats temporarily unavailable</p>
            </div>
        );
    }

    const totalBytes = languages.reduce((s, l) => s + l.bytes, 0);

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {/* Stats Card */}
            <div className="rounded-2xl border border-border overflow-hidden" style={{ background: bg }}>
                <div className="p-5">
                    <h3 className="text-base font-bold mb-4" style={{ color: accent }}>
                        {username}&apos;s GitHub Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <StatBox icon="📦" label="Repositories" value={stats.publicRepos} accent={accent} textColor={textCol} subColor={subtext} />
                        <StatBox icon="👥" label="Followers" value={stats.followers} accent={accent} textColor={textCol} subColor={subtext} />
                        <StatBox icon="⭐" label="Stars Earned" value={stats.totalStars} accent={accent} textColor={textCol} subColor={subtext} />
                        <StatBox icon="🔀" label="Forks" value={stats.totalForks} accent={accent} textColor={textCol} subColor={subtext} />
                    </div>
                </div>
            </div>

            {/* Languages Card */}
            <div className="rounded-2xl border border-border overflow-hidden" style={{ background: bg }}>
                <div className="p-5">
                    <h3 className="text-base font-bold mb-4" style={{ color: accent }}>Most Used Languages</h3>
                    <div className="space-y-3">
                        {languages.slice(0, 5).map((lang) => {
                            const pct = ((lang.bytes / totalBytes) * 100).toFixed(1);
                            const color = LANG_COLORS[lang.name] || accent;
                            return (
                                <div key={lang.name}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span style={{ color: textCol }}>{lang.name}</span>
                                        <span style={{ color: subtext }}>{pct}%</span>
                                    </div>
                                    <div className="h-2 rounded-full overflow-hidden" style={{ background: isDark ? "#313244" : "#ccd0da" }}>
                                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatBox({ icon, label, value, accent, textColor, subColor }: {
    icon: string; label: string; value: number; accent: string; textColor: string; subColor: string;
}) {
    return (
        <div className="text-center p-3 rounded-xl" style={{ background: `${accent}10` }}>
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-2xl font-bold" style={{ color: textColor }}>{value}</div>
            <div className="text-xs" style={{ color: subColor }}>{label}</div>
        </div>
    );
}
