"use client";

import {
  Check,
  Copy,
  Facebook,
  MessageCircle,
  Share2,
  Twitter,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

type Props = {
  title: string;
  url: string;
  summary?: string;
  compact?: boolean;
};

export default function ShareButtons({ title, url }: Props) {
  const [copied, setCopied] = useState(false);

  const withUtm = useCallback((base: string, source: string) => {
    const nextUrl = new URL(base);
    nextUrl.searchParams.set("utm_source", source);
    nextUrl.searchParams.set("utm_medium", "social");
    nextUrl.searchParams.set("utm_campaign", "post_share");
    return nextUrl.toString();
  }, []);

  const links = useMemo(() => {
    const encodedTitle = encodeURIComponent(title);
    return [
      {
        label: "WhatsApp",
        icon: MessageCircle,
        href: `https://wa.me/?text=${encodedTitle}%20${encodeURIComponent(
          withUtm(url, "whatsapp"),
        )}`,
      },
      {
        label: "X (Twitter)",
        icon: Twitter,
        href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodeURIComponent(
          withUtm(url, "x"),
        )}`,
      },
      {
        label: "Facebook",
        icon: Facebook,
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          withUtm(url, "facebook"),
        )}`,
      },
    ];
  }, [title, url, withUtm]);

  async function handleCopy() {
    await navigator.clipboard.writeText(withUtm(url, "copy"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="relative shrink-0">
      <details className="group/share">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-center gap-2 rounded-lg border border-[#d8ddd3] bg-white px-4 text-sm font-semibold text-[var(--article-heading)] transition-colors hover:border-[var(--article-line)] hover:bg-[var(--article-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--article-line)]">
          <Share2 className="size-4" aria-hidden="true" />
          Compartilhar
        </summary>

        <div className="absolute right-0 top-full z-30 mt-2 w-56 rounded-xl border border-[#d8ddd3] bg-white p-2 shadow-[0_18px_45px_rgba(29,61,50,0.16)]">
          {links.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm text-[var(--article-heading)] hover:bg-[var(--article-surface)]"
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </a>
          ))}

          <button
            type="button"
            onClick={handleCopy}
            className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-[var(--article-heading)] hover:bg-[var(--article-surface)]"
          >
            {copied ? (
              <Check className="size-4 text-emerald-700" aria-hidden="true" />
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
            {copied ? "Link copiado" : "Copiar link"}
          </button>
        </div>
      </details>
      <span className="sr-only" aria-live="polite">
        {copied ? "Link copiado para a área de transferência" : ""}
      </span>
    </div>
  );
}
