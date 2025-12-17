import PrintButton from "@/components/PrintButton";
import { cv as cvEn } from "@/data/cv.en";
import { cv as cvUa } from "@/data/cv.ua";

export const metadata = {
  title: "Ruslan_Lapiniak CV PDF",
  robots: { index: false, follow: false },
};

export default function PDFPage({
  searchParams,
}: {
  searchParams?: { lang?: string };
}) {
  const lang = searchParams?.lang === "ua" ? "ua" : "en";
  const cv = lang === "ua" ? cvUa : cvEn;

  return (
    <main className="mx-auto max-w-4xl bg-white p-10 text-black">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">{cv.name}</h1>
          <p className="mt-1 text-lg">{cv.role}</p>
          <p className="mt-2 text-sm text-gray-600">{cv.location}</p>
          <p className="mt-2 text-sm text-gray-700">
            {cv.contacts.email} • {cv.contacts.phone} • {cv.contacts.telegram}
          </p>
        </div>
        <PrintButton label={lang === "ua" ? "Друк / Зберегти PDF" : "Print / Save PDF"} />
      </div>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">{lang === "ua" ? "Професійний профіль" : "Professional Summary"}</h2>
        <p className="mt-2 text-sm text-gray-800">{cv.summary}</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">{lang === "ua" ? "Досвід" : "Experience"}</h2>
        <div className="mt-2 space-y-4">
          {cv.experience.map((job) => (
            <div key={`${job.company}-${job.role}`}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-medium">{job.role} — {job.company}</p>
                <p className="text-xs text-gray-600">{job.period}</p>
              </div>
              <ul className="mt-2 list-disc pl-5 text-sm">
                {job.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">{lang === "ua" ? "Навички" : "Skills"}</h2>
        <div className="mt-2 space-y-3">
          {Object.entries(cv.skills).map(([group, items]) => (
            <div key={group}>
              <p className="text-sm font-medium">{group}</p>
              <p className="text-sm text-gray-800">{items.join(", ")}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">{lang === "ua" ? "Проєкти" : "Projects"}</h2>
        <div className="mt-2 space-y-2 text-sm">
          {cv.projects.map((p) => (
            <p key={p.name}>
              <span className="font-medium">{p.name}:</span> {p.desc} ({p.link})
            </p>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">{lang === "ua" ? "Мови" : "Languages"}</h2>
        <p className="mt-2 text-sm text-gray-800">
          {cv.languages.map((l) => `${l.name} — ${l.level}`).join(" • ")}
        </p>
      </section>
    </main>
  );
}
