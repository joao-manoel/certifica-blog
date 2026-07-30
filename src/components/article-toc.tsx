"use client";

import { ChevronDown } from "lucide-react";
import { useMemo } from "react";

import { prepareArticleContent } from "@/utils/article-content";

export function ArticleToc({
  content,
  variant,
}: {
  content: unknown;
  variant: "mobile" | "desktop";
}) {
  const headings = useMemo(
    () => prepareArticleContent(content).headings,
    [content],
  );

  if (headings.length < 2) return null;

  const links = headings.map((heading) => (
    <li key={heading.id}>
      <a
        href={`#${heading.id}`}
        className={`block border-l border-transparent py-1.5 text-sm leading-snug text-[#5f675f] transition-colors hover:border-[var(--article-accent)] hover:text-[var(--article-heading)] ${
          heading.level === 3 ? "pl-6" : "pl-3 font-semibold"
        }`}
      >
        {heading.text}
      </a>
    </li>
  ));

  if (variant === "mobile") {
    return (
      <details className="article-toc-mobile rounded-2xl border border-[#d8ddd3] bg-white p-4 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-[var(--article-heading)]">
          Neste artigo
          <ChevronDown className="size-4" aria-hidden="true" />
        </summary>
        <ol className="mt-3 space-y-0.5">{links}</ol>
      </details>
    );
  }

  return (
      <nav
        className="hidden lg:block"
        aria-label="Sumário do artigo"
      >
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--article-support)]">
          Neste artigo
        </p>
        <ol className="max-h-[calc(100vh-10rem)] space-y-0.5 overflow-y-auto pr-2">
          {links}
        </ol>
      </nav>
  );
}
