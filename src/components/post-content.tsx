"use client";
import "prismjs/themes/prism-tomorrow.css";
import Prism from "prismjs";
import { isTinyHtml } from "@/utils/is-tiny-html-utils";
import { normalizeTinyMce, sanitizeHtml } from "@/utils/sanitize-html-utils";
import { useEffect } from "react";

type AnyJson = unknown;

export default function PostContent({ content }: { content: AnyJson }) {
  if (!content) return null;

  if (isTinyHtml(content)) {
    const normalized = normalizeTinyMce(content.html || "");
    const clean = sanitizeHtml(normalized, {
      allowedAttributes: {
        "*": ["href", "src", "alt", "title", "class", "id", "target", "rel"],
      },
    });

    useEffect(() => {
      Prism.highlightAll();
    }, [content]);

    return (
      <article className="tinymce-content">
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
