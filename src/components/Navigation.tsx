"use client";

import { LuUser, LuBriefcase, LuWrench, LuRocket, LuBot, LuLanguages } from "react-icons/lu";
import { useEffect, useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const SECTIONS = [
    { id: "about", en: "About", ua: "Про мене", icon: <LuUser size={18} /> },
    { id: "experience", en: "Experience", ua: "Досвід", icon: <LuBriefcase size={18} /> },
    { id: "skills", en: "Skills", ua: "Навички", icon: <LuWrench size={18} /> },
    { id: "projects", en: "Projects", ua: "Проєкти", icon: <LuRocket size={18} /> },
    { id: "ai-assistant", en: "AI Assistant", ua: "AI Помічник", icon: <LuBot size={18} /> },
];

export default function Navigation({ lang, otherLangHref }: { lang: "en" | "ua", otherLangHref: string }) {
    const [activeSegment, setActiveSegment] = useState("");
    const otherLabel = lang === "en" ? "UA" : "EN";

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSegment(entry.target.id);
                    }
                });
            },
            { threshold: 0.5 }
        );

        SECTIONS.forEach((section) => {
            const element = document.getElementById(section.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <nav className="sticky top-0 z-40 -mx-0 mb-4 bg-base/95 px-6 py-3 backdrop-blur-md border-b border-border">
            <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar">
                <ul className="flex items-center justify-center gap-1 sm:gap-10">
                    {SECTIONS.map((section) => (
                        <li key={section.id}>
                            <a
                                href={`#${section.id}`}
                                aria-label={lang === "en" ? section.en : section.ua}
                                className={`group whitespace-nowrap no-underline rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all sm:px-3 sm:py-2 flex items-center justify-center gap-0 hover:gap-2 ${activeSegment === section.id
                                    ? "bg-accent/10 text-accent"
                                    : "text-subtext hover:bg-surface/50 hover:text-text"
                                    }`}
                            >
                                <span className="shrink-0">{section.icon}</span>
                                <span className="hidden sm:block max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 ease-in-out">
                                    {lang === "en" ? section.en : section.ua}
                                </span>
                            </a>
                        </li>
                    ))}
                    <li className="ml-1 sm:ml-2 border-l border-border/20 pl-1 sm:pl-2 flex items-center gap-1">
                        <Link
                            href={otherLangHref}
                            className="group whitespace-nowrap no-underline rounded-lg px-2.5 py-1.5 text-xs font-medium text-subtext hover:bg-surface/50 hover:text-text transition-all sm:px-3 sm:py-2 flex items-center justify-center gap-0 hover:gap-2"
                        >
                            <span className="shrink-0"><LuLanguages size={18} /></span>
                            <span className="hidden sm:block max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 ease-in-out">
                                {lang === "en" ? "Українська" : "English"}
                            </span>
                        </Link>
                        <ThemeToggle variant="nav" />
                    </li>
                </ul>
            </div>
        </nav>
    );
}
