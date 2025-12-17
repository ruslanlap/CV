import Header from "@/components/Header";
import CVView from "@/components/CVView";
import { cv } from "@/data/cv.en";

export const metadata = {
  title: "Ruslan Lapiniak — CV (EN)",
  description: "Frontend Developer — React, TypeScript, UI/UX, DevTools",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Header
        lang="en"
        otherLangHref="/ua"
        title={cv.name}
        subtitle={`${cv.role} • ${cv.location}`}
      />
      <CVView cv={cv} lang="en" />
    </div>
  );
}
