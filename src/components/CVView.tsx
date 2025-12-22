"use client";

import { motion } from "framer-motion";
import Section from "@/components/Section";
import SpotlightCard from "@/components/SpotlightCard";
import Badge from "@/components/Badge";
import ProjectCard from "@/components/ProjectCard";
import GitHubStats from "@/components/GitHubStats";
import AIChatAssistant from "@/components/AIChatAssistant";
import { getIcon } from "@/components/icon-map";

import { CV } from "@/types/cv";

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.main
      className="pb-12 pt-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <Section
        id="about"
        title={lang === "en" ? "About" : "Про мене"}
      >
        <p className="text-subtext">{cv.summary}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Badge icon={getIcon("location")}>{cv.location}</Badge>
          <a href={`mailto:${cv.contacts.email}`} className="no-underline">
            <Badge icon={getIcon("email")}>{cv.contacts.email}</Badge>
          </a>
          <a href={`https://t.me/${cv.contacts.telegram.replace("@", "")}`} target="_blank" rel="noreferrer" className="no-underline">
            <Badge icon={getIcon("telegram")}>{cv.contacts.telegram}</Badge>
          </a>
          <a href={`https://github.com/${cv.contacts.github}`} target="_blank" rel="noreferrer" className="no-underline">
            <Badge icon={getIcon("github")}>{`GitHub: ${cv.contacts.github}`}</Badge>
          </a>
        </div>
      </Section>

      <Section id="experience" title={lang === "en" ? "Experience" : "Досвід"}>
        <div className="space-y-4">
          {cv.experience.map((job) => (
            <motion.div key={`${job.company}-${job.role}`} variants={item}>
              <SpotlightCard className="rounded-2xl border border-border bg-mantle p-5 transition-all hover:border-accent/30 dark:hover:shadow-lg dark:hover:shadow-accent/5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <p className="text-lg font-bold text-accent/90">{job.role}</p>
                  <p className="text-sm font-medium text-subtext/60">{job.period}</p>
                </div>
                <p className="text-sm font-semibold text-subtext">{job.company}</p>
                <ul className="mt-4 space-y-2 text-sm text-text/90">
                  {job.points.map((p) => (
                    <li key={p} className="relative pl-5 before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent/40">
                      {p}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section id="skills" title={lang === "en" ? "Skills" : "Навички"}>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(cv.skills).map(([group, items]) => (
            <motion.div key={group} variants={item} className="h-full">
              <SpotlightCard className="h-full rounded-2xl border border-border bg-mantle p-5 transition-all hover:border-accent/30 dark:hover:shadow-lg dark:hover:shadow-accent/5">
                <p className="font-bold text-accent/90 tracking-tight">{group}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {items.map((s) => (
                    <Badge key={s} icon={getIcon(s)}>{s}</Badge>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section id="projects" title={lang === "en" ? "Featured Projects" : "Проєкти"}>
        <div className="grid gap-4 md:grid-cols-2">
          {cv.projects.map((p, i) => (
            <motion.div key={p.name} variants={item} className="h-full">
              <ProjectCard name={p.name} desc={p.desc} link={p.link} stack={p.stack} featured={i === 0} />
            </motion.div>
          ))}
        </div>
      </Section>

      <Section id="github" title="GitHub">
        <GitHubStats username="ruslanlap" />
      </Section>

      <Section id="ai-assistant" title={lang === "en" ? "Ask My CV" : "Запитай про CV"}>
        <AIChatAssistant lang={lang} />
      </Section>

      <Section title={lang === "en" ? "Education & Courses" : "Освіта та Курси"}>
        <div className="grid gap-4 sm:grid-cols-2">
          {cv.courses.map((c) => (
            <motion.div key={c.name} variants={item} className="h-full">
              <SpotlightCard className="flex h-full flex-col rounded-2xl border border-border bg-mantle p-5 transition-all hover:border-accent/30 dark:hover:shadow-lg dark:hover:shadow-accent/5">
                <p className="font-bold text-accent/90 leading-tight tracking-tight">{c.name}</p>
                <div className="mt-auto pt-3 flex items-center justify-between text-xs font-medium text-subtext/60">
                  <span>{c.source}</span>
                  <span>{c.date}</span>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section title={lang === "en" ? "R&D & Hobbies" : "R&D та Хобі"}>
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
    </motion.main>

  );
}
