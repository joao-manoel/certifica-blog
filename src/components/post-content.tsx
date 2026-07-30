"use client";

import "prismjs/themes/prism-tomorrow.css";

import Prism from "prismjs";
import { useEffect, useMemo } from "react";

import { isTinyHtml } from "@/utils/is-tiny-html-utils";
import { prepareArticleContent } from "@/utils/article-content";

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process?: () => void;
      };
    };
  }
}

function ensureInstagramScript() {
  if (document.getElementById("ig-embed-script")) return;
  const script = document.createElement("script");
  script.id = "ig-embed-script";
  script.src = "https://www.instagram.com/embed.js";
  script.async = true;
  document.body.appendChild(script);
}

export default function PostContent({ content }: { content: unknown }) {
  const prepared = useMemo(() => prepareArticleContent(content), [content]);
  const isHtml = isTinyHtml(content);

  useEffect(() => {
    if (!isHtml) return;
    Prism.highlightAll();
  }, [isHtml, prepared.html]);

  useEffect(() => {
    if (!isHtml || !prepared.html.includes("instagram-media")) return;

    ensureInstagramScript();
    const processEmbeds = () => window.instgrm?.Embeds?.process?.();
    processEmbeds();
    const timer = window.setTimeout(processEmbeds, 100);
    return () => window.clearTimeout(timer);
  }, [isHtml, prepared.html]);

  if (!content) return null;

  if (isHtml) {
    return (
      <article className="tinymce-content">
        <div dangerouslySetInnerHTML={{ __html: prepared.html }} />
      </article>
    );
  }

  return (
    <pre className="rounded-xl bg-muted/30 p-4 text-xs whitespace-pre-wrap wrap-break-word">
      {JSON.stringify(content, null, 2)}
    </pre>
  );
}
