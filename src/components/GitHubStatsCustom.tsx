"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-context";

interface GitHubStats {
    publicRepos: number;
    followers: number;
    totalStars: number;
    totalForks: number;
    totalCommits: number;
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
    "C#": "#178600",
};

function calculateGrade(stats: GitHubStats): { grade: string; progress: number } {
    const score =
        stats.totalStars * 1 +
        stats.publicRepos * 0.25 +
        stats.followers * 0.5 +
        stats.totalForks * 0.5 +
        (stats.totalCommits || 0) * 0.1;

    if (score >= 1000) return { grade: "S", progress: 0.99 };
    if (score >= 500) return { grade: "A++", progress: 0.92 };
    if (score >= 250) return { grade: "A+", progress: 0.82 };
    if (score >= 100) return { grade: "A", progress: 0.72 };
    if (score >= 50) return { grade: "B+", progress: 0.60 };
    if (score >= 25) return { grade: "B", progress: 0.50 };
    return { grade: "C", progress: 0.40 };
}

function formatNumber(num: number): string {
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
}

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
    const ringBg = isDark ? "#313244" : "#ccd0da";
    const iconCol = isDark ? "#a6adc8" : "#7c7f93";

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2">
                <div className="h-[220px] animate-pulse rounded-2xl border border-border bg-mantle" />
                <div className="h-[220px] animate-pulse rounded-2xl border border-border bg-mantle" />
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

    const { grade, progress } = calculateGrade(stats);
    const totalBytes = languages.reduce((s, l) => s + l.bytes, 0);

    // SVG ring params
    const ringSize = 100;
    const ringRadius = 38;
    const ringStroke = 6;
    const circumference = 2 * Math.PI * ringRadius;
    const dashOffset = circumference * (1 - progress);

    const statRows = [
        { icon: "star", label: "Total Stars", value: stats.totalStars },
        ...(stats.totalCommits > 0
            ? [{ icon: "commit", label: "Total Commits", value: stats.totalCommits }]
            : []),
        { icon: "repo", label: "Total Repos", value: stats.publicRepos },
        { icon: "people", label: "Followers", value: stats.followers },
        { icon: "fork", label: "Total Forks", value: stats.totalForks },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {/* Stats Card - github-readme-stats style */}
            <div className="rounded-2xl border border-border overflow-hidden" style={{ background: bg }}>
                <div className="p-5 flex items-start gap-4">
                    {/* Left: title + stat rows */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold mb-4" style={{ color: accent }}>
                            {username}&apos;s GitHub Stats
                        </h3>
                        <div className="space-y-2.5">
                            {statRows.map((row) => (
                                <div key={row.label} className="flex items-center gap-2.5 text-sm">
                                    <StatIcon name={row.icon} color={iconCol} />
                                    <span style={{ color: subtext }} className="flex-1">
                                        {row.label}:
                                    </span>
                                    <span className="font-bold tabular-nums" style={{ color: textCol }}>
                                        {formatNumber(row.value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: grade ring */}
                    <div className="flex-shrink-0 flex items-center justify-center pt-4">
                        <svg
                            width={ringSize}
                            height={ringSize}
                            viewBox={`0 0 ${ringSize} ${ringSize}`}
                        >
                            {/* Background ring */}
                            <circle
                                cx={ringSize / 2}
                                cy={ringSize / 2}
                                r={ringRadius}
                                fill="none"
                                stroke={ringBg}
                                strokeWidth={ringStroke}
                            />
                            {/* Progress ring */}
                            <circle
                                cx={ringSize / 2}
                                cy={ringSize / 2}
                                r={ringRadius}
                                fill="none"
                                stroke={accent}
                                strokeWidth={ringStroke}
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={dashOffset}
                                transform={`rotate(-90, ${ringSize / 2}, ${ringSize / 2})`}
                                style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
                            />
                            {/* Grade text */}
                            <text
                                x={ringSize / 2}
                                y={ringSize / 2}
                                textAnchor="middle"
                                dominantBaseline="central"
                                fill={textCol}
                                fontSize={grade.length > 2 ? "18" : "22"}
                                fontWeight="bold"
                                fontFamily="inherit"
                            >
                                {grade}
                            </text>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Languages Card */}
            <div className="rounded-2xl border border-border overflow-hidden" style={{ background: bg }}>
                <div className="p-5">
                    <h3 className="text-sm font-bold mb-4" style={{ color: accent }}>Most Used Languages</h3>
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
                                    <div className="h-2 rounded-full overflow-hidden" style={{ background: ringBg }}>
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${pct}%`,
                                                background: color,
                                                transition: "width 1s ease-in-out",
                                            }}
                                        />
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

function StatIcon({ name, color }: { name: string; color: string }) {
    const size = 16;
    const props = { width: size, height: size, viewBox: "0 0 16 16", fill: color };

    switch (name) {
        case "star":
            return (
                <svg {...props}>
                    <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                </svg>
            );
        case "commit":
            return (
                <svg {...props}>
                    <path d="M11.93 8.5a4.002 4.002 0 01-7.86 0H.75a.75.75 0 010-1.5h3.32a4.002 4.002 0 017.86 0h3.32a.75.75 0 010 1.5h-3.32zM8 10.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                </svg>
            );
        case "repo":
            return (
                <svg {...props}>
                    <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1h-8a1 1 0 00-1 1v6.708A2.486 2.486 0 014.5 9h8V1.5zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
                </svg>
            );
        case "people":
            return (
                <svg {...props}>
                    <path d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z" />
                </svg>
            );
        case "fork":
            return (
                <svg {...props}>
                    <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                </svg>
            );
        default:
            return null;
    }
}
