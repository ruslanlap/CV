import Badge from "./Badge";
import { getIcon } from "./icon-map";

export default function ProjectCard({
  name,
  desc,
  link,
  stack,
  featured,
}: {
  name: string;
  desc: string;
  link: string;
  stack?: readonly string[];
  featured?: boolean;
}) {
  return (
    <div className={`group relative flex h-full flex-col rounded-2xl border transition-all p-5 bg-mantle
      ${featured
        ? 'border-accent/60 dark:shadow-lg dark:shadow-accent/10'
        : 'border-border hover:border-accent/40 dark:hover:shadow-lg dark:hover:shadow-accent/5'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="text-lg font-bold text-accent decoration-transparent transition-all focus-visible:outline-none"
          >
            {name}
            <span className="absolute inset-0" aria-hidden="true" />
          </a>
          <p className="mt-2 text-sm text-subtext leading-relaxed line-clamp-2">{desc}</p>
        </div>
        <span className="text-subtext/40 group-hover:text-accent transition-all duration-300 translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
        </span>
      </div>

      {stack?.length ? (
        <div className="mt-auto pt-4 flex flex-wrap gap-2 relative z-10">
          {stack.map((t) => (
            <Badge key={t} icon={getIcon(t)}>
              {t}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}
