"use client";

import { useMemo } from "react";

interface VCardButtonProps {
    cv: {
        name: string;
        role: string;
        location: string;
        contacts: {
            email: string;
            phone: string;
            github: string;
        };
    };
    label: string;
}

export default function VCardButton({ cv, label }: VCardButtonProps) {
    const handleDownloadVCard = () => {
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${cv.name}
TITLE:${cv.role}
EMAIL:${cv.contacts.email}
TEL:${cv.contacts.phone}
URL:${cv.contacts.github}
ADR:;;${cv.location};;;;
END:VCARD`;
        const blob = new Blob([vcard], { type: "text/vcard" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${cv.name.replace(" ", "_")}.vcf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <button
            onClick={handleDownloadVCard}
            className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-border bg-base px-4 py-2 text-sm font-medium text-text hover:bg-surface/50 transition"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
            {label}
        </button>
    );
}
