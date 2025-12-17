export default function ProjectCard({
  name,
  desc,
  link,
  stack,
}: {
  name: string;
  desc: string;
  link: string;
  stack?: readonly string[];
}) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="block rounded-2xl border border-border bg-mantle p-5 hover:bg-surface/60 transition"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="mt-1 text-sm text-subtext">{desc}</p>
        </div>
        <span className="text-subtext">↗</span>
      </div>

      {stack?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {stack.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-base px-3 py-1 text-xs text-subtext"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </a>
  );
}
