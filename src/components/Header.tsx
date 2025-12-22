"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import me from "@/assets/me.png";

export default function Header({
  lang,
  otherLangHref,
  title,
  subtitle,
  children,
}: {
  lang: "en" | "ua";
  otherLangHref: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const otherLabel = lang === "en" ? "UA" : "EN";

  // Calculate age from birthdate
  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const birthDate = new Date(1990, 10, 24); // Month is 0-indexed (10 = November)
  const age = calculateAge(birthDate);
  const ageText = lang === "en" ? `${age} years old` : `${age} років`;

  return (
    <header className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 items-start">
      <button
        onClick={() => setIsImageOpen(true)}
        className="relative h-20 w-20 sm:h-32 sm:w-32 shrink-0 group focus:outline-none focus:ring-2 focus:ring-accent rounded-full"
        aria-label={lang === "en" ? "View full size photo" : "Відкрити фото на весь екран"}
      >
        <Image
          src={me}
          alt={title}
          className="rounded-full border-2 border-border object-cover aspect-square dark:shadow-sm transition-transform group-hover:scale-[1.03]"
          fill
          priority
          sizes="(max-width: 640px) 80px, 128px"
        />
      </button>
      <div className="flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-4 w-full">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">{title}</h1>
          <div className="flex items-center gap-2">{children}</div>
        </div>
        <p className="mt-2 text-lg text-subtext leading-snug">{subtitle}</p>
        <p className="mt-2 flex items-center gap-2 text-sm text-subtext/80">
          <svg
            className="h-4 w-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="whitespace-nowrap">24.11.1990 • {ageText}</span>
        </p>

      </div>

      {isImageOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-crust/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsImageOpen(false)}
        >
          <div className="relative max-w-2xl w-full aspect-square animate-in zoom-in-95 duration-200">
            <Image
              src={me}
              alt={title}
              className="rounded-2xl dark:shadow-2xl border-2 border-border object-contain"
              fill
            />
            <button
              className="absolute -top-12 right-0 text-text/80 hover:text-text transition-colors flex items-center gap-1 text-sm font-medium"
              onClick={(e) => {
                e.stopPropagation();
                setIsImageOpen(false);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              {lang === "en" ? "Close" : "Закрити"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
