export default function Section({
  title,
  children,
  right,
  id,
}: {
  title: string;
  children: React.ReactNode;
  right?: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="mt-10 first-of-type:mt-0 scroll-mt-20">
      <div className="flex items-end justify-between gap-4 border-b border-border/50 pb-2">
        <h2 className="text-xl font-bold tracking-tight text-text/90">{title}</h2>
        {right}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
