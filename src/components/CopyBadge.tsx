"use client";

import { useState } from "react";
import { LuCheck, LuCopy } from "react-icons/lu";

export default function CopyBadge({
  icon,
  children,
  copyText,
  href,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  copyText?: string;
  href?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    if (!copyText) return;

    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const badgeContent = (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-subtext transition-all group-hover:border-accent/30 group-hover:bg-surface/80 group-hover:text-text">
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {copyText && (
        <span className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {copied ? <LuCheck size={14} className="text-green" /> : <LuCopy size={14} />}
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="group no-underline inline-block"
        onClick={copyText ? handleCopy : undefined}
        title={copyText ? `Click to copy: ${copyText}` : undefined}
      >
        {badgeContent}
      </a>
    );
  }

  if (copyText) {
    return (
      <button
        onClick={handleCopy}
        className="group cursor-pointer border-0 bg-transparent p-0"
        title={`Click to copy: ${copyText}`}
      >
        {badgeContent}
      </button>
    );
  }

  return <span className="inline-block">{badgeContent}</span>;
}
