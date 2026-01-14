"use client";

import { CV } from "@/types/cv";

interface PDFExportButtonProps {
    cv: CV;
    lang: "en" | "ua";
    label?: string;
}

export default function PDFExportButton({ cv, lang, label }: PDFExportButtonProps) {
    const defaultLabel = lang === "ua" ? "PDF" : "PDF";

    const handleExport = () => {
        // Open print page
        window.open(`/cv/pdf?lang=${lang}`, "_blank");
    };

    return (
        <button
            onClick={handleExport}
            className="no-underline rounded-lg bg-accent px-4 h-9 min-w-[85px] text-sm font-bold text-base hover:opacity-90 transition inline-flex items-center justify-center gap-2 shadow-sm shadow-accent/20 box-border flex-shrink-0"
            title={lang === "ua" ? "Завантажити PDF" : "Download PDF"}
            aria-label={lang === "ua" ? "Завантажити CV у форматі PDF" : "Download CV as PDF"}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            <span>{label || defaultLabel}</span>
        </button>
    );
}
