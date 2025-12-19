import { JSX } from "react";
import {
    SiReact,
    SiTypescript,
    SiJavascript,
    SiHtml5,
    SiCss3,
    SiTailwindcss,
    SiStyledcomponents,
    SiSass,
    SiRedux,
    SiVite,
    SiWebpack,
    SiNpm,
    SiYarn,
    SiGit,
    SiGithub,
    SiFigma,
    SiAdobephotoshop,
    SiAdobeillustrator,
    SiDotnet,
    SiTelegram,
    SiLinkedin,
    SiPython,
} from "react-icons/si";
import {
    LuMail,
    LuPhone,
    LuMapPin,
    LuGlobe,
    LuCpu,
    LuDatabase,
    LuPalette,
    LuCode,
    LuTerminal,
    LuLayers,
    LuBox,
    LuUsers,
    LuMessageSquare,
    LuGraduationCap,
    LuBrainCircuit,
    LuRefreshCw,
    LuClock,
} from "react-icons/lu";

export function getIcon(name: string): JSX.Element | null {
    const norm = name.toLowerCase();

    // Contacts
    if (norm.includes("email") || norm.includes("@")) return <LuMail />;
    if (norm.includes("phone")) return <LuPhone />;
    if (norm.includes("telegram")) return <SiTelegram />;
    if (norm.includes("github")) return <SiGithub />;
    if (norm.includes("linkedin")) return <SiLinkedin />;
    if (norm.includes("location") || norm.includes("львів") || norm.includes("lviv")) return <LuMapPin />;

    // Tech Stack (Exact or partial matches)
    if (norm.includes("react")) return <SiReact />;
    if (norm.includes("typescript")) return <SiTypescript />;
    if (norm.includes("javascript")) return <SiJavascript />;
    if (norm.includes("html")) return <SiHtml5 />;
    if (norm.includes("css")) return <SiCss3 />;
    if (norm.includes("tailwind")) return <SiTailwindcss />;
    if (norm.includes("styled")) return <SiStyledcomponents />;
    if (norm.includes("sass") || norm.includes("scss")) return <SiSass />;
    if (norm.includes("redux")) return <SiRedux />;
    if (norm.includes("vite")) return <SiVite />;
    if (norm.includes("webpack")) return <SiWebpack />;
    if (norm.includes("npm")) return <SiNpm />;
    if (norm.includes("yarn")) return <SiYarn />;
    if (norm.includes("git")) return <SiGit />;
    if (norm.includes("figma")) return <SiFigma />;
    if (norm.includes("photoshop")) return <SiAdobephotoshop />;
    if (norm.includes("illustrator")) return <SiAdobeillustrator />;
    if (norm.includes("c#")) return <SiDotnet />;
    if (norm.includes(".net")) return <SiDotnet />;
    if (norm.includes("mkdocs")) return <LuCode />;
    if (norm.includes("python")) return <SiPython />;
    if (norm.includes("click") || norm.includes("typer") || norm.includes("tui") || norm.includes("terminal")) return <LuTerminal />;
    if (norm.includes("notion")) return <LuDatabase />;
    if (norm.includes("design") || norm.includes("material") || norm.includes("wpf") || norm.includes("svg")) return <LuPalette />;
    if (norm.includes("telegram") || norm.includes("pyrogram") || norm.includes("aiogram")) return <SiTelegram />;
    if (norm.includes("api")) return <LuGlobe />;
    if (norm.includes("uv") || norm.includes("pip") || norm.includes("pypi")) return <LuBox />;
    if (norm.includes("context api")) return <LuCpu />;
    if (norm.includes("zustand")) return <LuDatabase />; // Placeholder
    if (norm.includes("rest api")) return <LuGlobe />;

    // Languages (Country flags placeholders)
    if (norm === "ua" || norm === "ukrainian" || norm === "українська") return <span className="text-[10px] font-bold">UA</span>;
    if (norm === "en" || norm === "english" || norm === "англійська") return <span className="text-[10px] font-bold">EN</span>;

    // Categories (if needed fallback)
    if (norm.includes("frontend")) return <LuCode />;
    if (norm.includes("design")) return <LuPalette />;
    if (norm.includes("build")) return <LuBox />;
    if (norm.includes("version")) return <LuTerminal />;

    // Soft Skills
    if (norm.includes("leadership") || norm.includes("лідерство")) return <LuUsers />;
    if (norm.includes("communication") || norm.includes("комунікація")) return <LuMessageSquare />;
    if (norm.includes("mentoring") || norm.includes("менторство")) return <LuGraduationCap />;
    if (norm.includes("problem solving") || norm.includes("вирішення проблем")) return <LuBrainCircuit />;
    if (norm.includes("adaptability") || norm.includes("адаптивність")) return <LuRefreshCw />;
    if (norm.includes("teamwork") || norm.includes("командна робота")) return <LuUsers />;
    if (norm.includes("time management") || norm.includes("тайм-менеджмент")) return <LuClock />;

    return <LuLayers />; // Default generic
}
