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
    <span className="relative inline-flex items-center gap-2 rounded-xl border border-border/60 bg-gradient-to-br from-surface/80 to-mantle/60 px-4 py-2 text-sm font-medium text-subtext shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:border-accent/50 group-hover:shadow-md group-hover:shadow-accent/10 group-hover:text-text group-hover:-translate-y-0.5 dark:from-surface/40 dark:to-mantle/40">
      {icon && (
        <span className="shrink-0 text-accent/70 transition-colors group-hover:text-accent">
          {icon}
        </span>
      )}
      <span className="font-medium">{children}</span>
      {copyText && (
        <span className="shrink-0 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0 -translate-x-1">
          {copied ? (
            <LuCheck size={14} className="text-green" />
          ) : (
            <LuCopy size={14} className="text-subtext/60" />
          )}
        </span>
      )}
      {copied && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium text-green bg-surface border border-green/20 rounded-md shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
          Copied!
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

  return <span className="group inline-block">{badgeContent}</span>;
}
