import Header from "@/components/Header";
import CVView from "@/components/CVView";
import Navigation from "@/components/Navigation";
import VCardButton from "@/components/VCardButton";
import PDFExportButton from "@/components/PDFExportButton";
import EasterEgg from "@/components/EasterEgg";
import { cv } from "@/data/cv.en";

export const metadata = {
  title: "Ruslan Lapiniak — CV (EN)",
  description: "Frontend Developer — React, TypeScript, UI/UX, DevTools",
  alternates: {
    canonical: "/en",
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
          lang="en"
          otherLangHref="/ua"
          title={cv.name}
          subtitle={`${cv.role} • ${cv.location}`}
        >
          <VCardButton cv={cv} label="Save" />
          <PDFExportButton cv={cv} lang="en" label="PDF" />
        </Header>
        <Navigation lang="en" otherLangHref="/ua" />
        <CVView cv={cv} lang="en" />
        <EasterEgg />
      </div>
    </>
  );
}
