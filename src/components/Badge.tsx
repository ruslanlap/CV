import { ReactNode } from "react";

export default function Badge({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border/50 bg-base/50 px-2.5 py-0.5 text-[11px] font-medium text-subtext transition-all hover:bg-surface/30 hover:text-text hover:border-accent/30 dark:shadow-sm">
      {icon && <span className="mr-1.5 opacity-60 flex items-center" aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
}
