import Header from "@/components/Header";
import CVView from "@/components/CVView";
import { cv } from "@/data/cv.ua";

export const metadata = {
  title: "Руслан Лапіняк — CV (UA)",
  description: "Frontend Developer — React, TypeScript, UI/UX, DevTools",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Header
        lang="ua"
        otherLangHref="/en"
        title={cv.name}
        subtitle={`${cv.role} • ${cv.location}`}
      />
      <CVView cv={cv} lang="ua" />
    </div>
  );
}
