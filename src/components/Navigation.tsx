"use client";

import { LuUser, LuBriefcase, LuWrench, LuRocket, LuBot, LuLanguages, LuMenu, LuX } from "react-icons/lu";
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
            {
                threshold: 0.5,
                rootMargin: "-80px 0px -40% 0px"
            }
        );

        SECTIONS.forEach((section) => {
            const element = document.getElementById(section.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const navHeight = 60;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            setIsMenuOpen(false);
        }
    };

    return (
        <nav className="sticky top-0 z-40 -mx-0 mb-4 bg-base/95 px-6 py-3 backdrop-blur-md border-b border-border">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center gap-2 overflow-x-auto no-scrollbar">
                <ul className="flex items-center justify-center gap-1 sm:gap-10">
                    {SECTIONS.map((section) => (
                        <li key={section.id}>
                            <a
                                href={`#${section.id}`}
                                onClick={(e) => handleSmoothScroll(e, section.id)}
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
                            aria-label={lang === "en" ? "Switch to Ukrainian" : "Змінити на англійську"}
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

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center justify-between">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 rounded-lg text-text hover:bg-surface/50 transition-colors"
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                    {isMenuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
                </button>
                <div className="flex items-center gap-2">
                    <Link
                        href={otherLangHref}
                        aria-label={lang === "en" ? "Switch to Ukrainian" : "Змінити на англійську"}
                        className="p-2 rounded-lg text-subtext hover:bg-surface/50 hover:text-text transition-colors"
                    >
                        <LuLanguages size={20} />
                    </Link>
                    <ThemeToggle variant="nav" />
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden mt-3 pb-2 animate-in slide-in-from-top-2 duration-200">
                    <ul className="flex flex-col gap-1">
                        {SECTIONS.map((section) => (
                            <li key={section.id}>
                                <a
                                    href={`#${section.id}`}
                                    onClick={(e) => handleSmoothScroll(e, section.id)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                                        activeSegment === section.id
                                            ? "bg-accent/10 text-accent font-medium"
                                            : "text-subtext hover:bg-surface/50 hover:text-text"
                                    }`}
                                >
                                    {section.icon}
                                    <span>{lang === "en" ? section.en : section.ua}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </nav>
    );
}
