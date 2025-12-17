import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import me from "@/assets/me.png";

export default function Header({
  lang,
  otherLangHref,
  title,
  subtitle,
}: {
  lang: "en" | "ua";
  otherLangHref: string;
  title: string;
  subtitle: string;
}) {
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
    <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-center gap-5">
        <Image
          src={me}
          alt={title}
          className="h-24 w-24 rounded-full border-2 border-border object-cover"
          priority
        />
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-lg text-subtext">{subtitle}</p>
          <p className="mt-1 flex items-center gap-2 text-sm text-subtext/80">
            <svg
              className="h-4 w-4"
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
            <span>24.11.1990 • {ageText}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href={otherLangHref}
          className="no-underline rounded-lg border border-border bg-mantle px-3 py-2 text-sm hover:bg-surface/60 transition"
          aria-label="Switch language"
        >
          {otherLabel}
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
