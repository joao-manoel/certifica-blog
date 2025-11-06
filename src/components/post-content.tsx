"use client";
import "prismjs/themes/prism-tomorrow.css";
import Prism from "prismjs";
import { isTinyHtml } from "@/utils/is-tiny-html-utils";
import { normalizeTinyMce, sanitizeHtml } from "@/utils/sanitize-html-utils";
import { useEffect, useMemo, useState } from "react";

type AnyJson = unknown;

// Converte iframes do Instagram para o formato blockquote oficial
function normalizeInstagramEmbeds(html: string) {
  return html.replace(
    /<iframe[^>]*class=["']?instagram-media["']?[^>]*src=["']([^"']+)["'][^>]*><\/iframe>/gi,
    (_m, src: string) => {
      // exemplos de src: https://www.instagram.com/p/XXXX/embed
      // removemos "/embed" e querystring
      try {
        const u = new URL(src);
        const permalink =
          u.origin +
          u.pathname.replace(/\/embed\/?$/, "").replace(/\/$/, "") +
          "/";
        return `<blockquote class="instagram-media" data-instgrm-permalink="${permalink}" data-instgrm-version="14"></blockquote>`;
      } catch {
        return _m; // se não parsear, mantém o original
      }
    }
  );
}

function ensureInstagramScript() {
  if (typeof window === "undefined") return;
  if (document.getElementById("ig-embed-script")) return;
  const s = document.createElement("script");
  s.id = "ig-embed-script";
  s.src = "https://www.instagram.com/embed.js";
  s.async = true;
  document.body.appendChild(s);
}

export default function PostContent({ content }: { content: AnyJson }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!content) return null;

  if (isTinyHtml(content)) {
    // 1) Normalizações determinísticas ANTES de sanitizar
    const normalized = useMemo(() => {
      const base = normalizeTinyMce(content.html || "");
      return normalizeInstagramEmbeds(base); // força sempre <blockquote>
    }, [content]);

    // 2) Sanitização (não remova data-instgrm-*)
    const clean = useMemo(() => {
      return sanitizeHtml(normalized, {
        allowedAttributes: {
          "*": [
            "href",
            "src",
            "alt",
            "title",
            "class",
            "id",
            "target",
            "rel",
            "style",
            "width",
            "height",
            "data-instgrm-permalink",
            "data-instgrm-version",
          ],
        },
      });
    }, [normalized]);

    useEffect(() => {
      Prism.highlightAll();
    }, [clean]);

    useEffect(() => {
      if (!mounted) return;
      ensureInstagramScript();
      // tenta processar logo após montar
      const process = () => {
        // @ts-ignore
        if (window.instgrm?.Embeds?.process) {
          // @ts-ignore
          window.instgrm.Embeds.process();
        }
      };
      process();
      const t = setTimeout(process, 50);
      return () => clearTimeout(t);
    }, [mounted, clean]);

    // 3) Evite hidratar com HTML que mudará: só renderize após mount
    if (!mounted) {
      // opcional: skeleton/placeholder
      return <article className="tinymce-content" suppressHydrationWarning />;
    }

    return (
      <article className="tinymce-content" suppressHydrationWarning>
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: clean }} />
      </article>
    );
  }

  return (
    <pre className="text-xs whitespace-pre-wrap wrap-break-word bg-muted/30 p-4 rounded-xl">
      {JSON.stringify(content, null, 2)}
    </pre>
  );
}
