import { ReactNode } from "react";

export default function Badge({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-gradient-to-br from-surface/80 to-mantle/60 px-4 py-2 text-sm font-medium text-subtext shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-accent/50 hover:shadow-md hover:shadow-accent/10 hover:text-text hover:-translate-y-0.5 dark:from-surface/40 dark:to-mantle/40">
      {icon && <span className="text-accent/70">{icon}</span>}
      {children}
    </span>
  );
}
