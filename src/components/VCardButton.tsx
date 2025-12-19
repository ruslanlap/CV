"use client";

import { CV } from "@/types/cv";

interface VCardButtonProps {
    cv: CV;
    label: string;
}

function sanitizeVCardField(field: string): string {
    return field.replace(/\n/g, " ").replace(/;/g, "\\;").replace(/,/g, "\\,").trim();
}

export default function VCardButton({ cv, label }: VCardButtonProps) {
    const handleDownloadVCard = () => {
        const name = sanitizeVCardField(cv.name);
        const role = sanitizeVCardField(cv.role);
        const email = sanitizeVCardField(cv.contacts.email);
        const phone = sanitizeVCardField(cv.contacts.phone);
        const github = sanitizeVCardField(cv.contacts.github);
        const location = sanitizeVCardField(cv.location);

        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TITLE:${role}
EMAIL:${email}
TEL:${phone}
URL:${github}
ADR:;;${location};;;;
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
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-base px-4 h-9 min-w-[85px] text-sm font-bold text-text hover:bg-surface/50 transition shadow-sm box-border flex-shrink-0"
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
