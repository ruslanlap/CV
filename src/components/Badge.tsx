import { ReactNode } from "react";

export default function Badge({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-mantle px-3 py-1 text-xs text-text transition hover:bg-surface/50">
      {icon && <span className="mr-1.5 opacity-70 flex items-center shadow-sm">{icon}</span>}
      {children}
    </span>
  );
}
