import Section from "@/components/Section";
import Badge from "@/components/Badge";
import ProjectCard from "@/components/ProjectCard";
import GitHubStats from "@/components/GitHubStats";
import AIChatAssistant from "@/components/AIChatAssistant";
import { getIcon } from "@/components/icon-map";

interface CV {
  name: string;
  role: string;
  location: string;
  contacts: {
    email: string;
    phone: string;
    telegram: string;
    github: string;
    linkedin: string;
  };
  summary: string;
  skills: Record<string, readonly string[]>;
  experience: readonly {
    role: string;
    company: string;
    period: string;
    points: readonly string[];
  }[];
  projects: readonly {
    name: string;
    desc: string;
    link: string;
    stack: readonly string[];
  }[];
  languages: readonly {
    name: string;
    level: string;
  }[];
  courses: readonly {
    name: string;
    source: string;
    date: string;
    link?: string;
  }[];
  hobbies: readonly string[];
}

import VCardButton from "@/components/VCardButton";

// ... (existing imports)

export default function CVView({
  cv,
  lang,
}: {
  cv: CV;
  lang: "en" | "ua";
}) {
  const pdfHref = `/cv/pdf?lang=${lang}`;

  return (
    <main className="py-12">
      <Section
        title={lang === "en" ? "About" : "Про мене"}
        right={
          <div className="flex gap-2">
            <VCardButton cv={cv} label={lang === "en" ? "Save Contact" : "Зберегти контакт"} />
            <a
              href={pdfHref}
              target="_blank"
              rel="noreferrer"
              className="no-underline rounded-lg bg-accent px-4 py-2 text-sm font-medium text-base2 hover:opacity-90 transition inline-flex items-center gap-2"
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
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              {lang === "en" ? "Download PDF" : "Завантажити PDF"}
            </a>
          </div>
        }
      >
        <p className="text-subtext">{cv.summary}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Badge icon={getIcon("location")}>{cv.location}</Badge>
          <Badge icon={getIcon("email")}>{cv.contacts.email}</Badge>
          <Badge icon={getIcon("telegram")}>{cv.contacts.telegram}</Badge>
          <Badge icon={getIcon("github")}>{"GitHub: ruslanlap"}</Badge>
        </div>
      </Section>

      <Section title={lang === "en" ? "Experience" : "Досвід"}>
        <div className="space-y-6">
          {cv.experience.map((job) => (
            <div key={`${job.company}-${job.role}`} className="rounded-2xl border border-border bg-mantle p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <p className="text-lg font-semibold">{job.role}</p>
                <p className="text-sm text-subtext">{job.period}</p>
              </div>
              <p className="text-sm text-subtext">{job.company}</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-text">
                {job.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title={lang === "en" ? "Skills" : "Навички"}>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(cv.skills).map(([group, items]) => (
            <div key={group} className="rounded-2xl border border-border bg-mantle p-5">
              <p className="font-semibold">{group}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {items.map((s) => (
                  <Badge key={s} icon={getIcon(s)}>{s}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={lang === "en" ? "Featured Projects" : "Проєкти"}>
        <div className="grid gap-4 md:grid-cols-2">
          {cv.projects.map((p) => (
            <ProjectCard key={p.name} name={p.name} desc={p.desc} link={p.link} stack={p.stack} />
          ))}
        </div>
      </Section>

      <Section title="GitHub">
        <GitHubStats username="ruslanlap" />
      </Section>

      <Section title={lang === "en" ? "Ask My CV" : "Запитай про CV"}>
        <AIChatAssistant lang={lang} />
      </Section>

      <Section title={lang === "en" ? "Education & Courses" : "Освіта та Курси"}>
        <div className="grid gap-4 sm:grid-cols-2">
          {cv.courses.map((c) => (
            <div key={c.name} className="flex flex-col rounded-2xl border border-border bg-mantle p-5">
              <p className="font-semibold leading-tight">{c.name}</p>
              <div className="mt-2 flex items-center justify-between text-sm text-subtext">
                <span>{c.source}</span>
                <span>{c.date}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={lang === "en" ? "Hobbies & Interests" : "Хобі та Інтереси"}>
        <div className="flex flex-wrap gap-2">
          {cv.hobbies.map((hobby) => (
            <Badge key={hobby} icon={<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5c0-2-2-4-2-4 0-2 2-4 2-4" /></svg>}>
              {hobby}
            </Badge>
          ))}
        </div>
      </Section>

      <Section title={lang === "en" ? "Languages" : "Мови"}>
        <div className="flex flex-wrap gap-2">
          {cv.languages.map((l) => (
            <Badge key={l.name} icon={getIcon((l.name as string) === "Українська" || (l.name as string) === "Ukrainian" ? "ua" : "en")}>
              {l.name} — {l.level}
            </Badge>
          ))}
        </div>
      </Section>

      <footer className="mt-12 text-center text-sm text-subtext">
        <p>
          {lang === "en" ? "Built with Next.js + Tailwind + Catppuccin." : "Зроблено на Next.js + Tailwind + Catppuccin."}
        </p>
      </footer>
    </main>
  );
}
