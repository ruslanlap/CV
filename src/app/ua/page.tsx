import Header from "@/components/Header";
import CVView from "@/components/CVView";
import Navigation from "@/components/Navigation";
import VCardButton from "@/components/VCardButton";
import EasterEgg from "@/components/EasterEgg";
import { cv } from "@/data/cv.ua";

export const metadata = {
  title: "Руслан Лапіняк — CV (UA)",
  description: "Frontend Developer — React, TypeScript, UI/UX, DevTools",
  alternates: {
    canonical: "/ua",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: cv.name,
  jobTitle: cv.role,
  address: {
    "@type": "PostalAddress",
    addressLocality: cv.location,
  },
  email: cv.contacts.email,
  telephone: cv.contacts.phone,
  url: "https://ruslan-cv.vercel.app",
  sameAs: [
    `https://github.com/${cv.contacts.github}`,
    `https://t.me/${cv.contacts.telegram.replace("@", "")}`,
  ],
  description: cv.summary,
  worksFor: {
    "@type": "Organization",
    name: "Freelance",
  },
  knowsAbout: Object.values(cv.skills).flat(),
  alumniOf: cv.courses.map((course) => ({
    "@type": "EducationalOrganization",
    name: course.source,
  })),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-6 py-10">
      <Header
        lang="ua"
        otherLangHref="/en"
        title={cv.name}
        subtitle={`${cv.role} • ${cv.location}`}
      >
        <VCardButton cv={cv} label="Save" />
        <a
          href="/cv/pdf?lang=ua"
          target="_blank"
          rel="noreferrer"
          className="no-underline rounded-lg bg-accent px-4 h-9 min-w-[85px] text-sm font-bold text-base2 hover:opacity-90 transition inline-flex items-center justify-center gap-2 shadow-sm shadow-accent/20 box-border flex-shrink-0"
          title="Download PDF"
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
          PDF
        </a>
      </Header>
      <Navigation lang="ua" otherLangHref="/en" />
      <CVView cv={cv} lang="ua" />
      <EasterEgg />
    </div>
    </>
  );
}
