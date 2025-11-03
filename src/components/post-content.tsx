// components/blog/post-content.tsx
"use client";

import { isTinyHtml } from "@/utils/is-tiny-html-utils";
import { normalizeTinyMce, sanitizeHtml } from "@/utils/sanitize-html-utils";

type AnyJson = unknown;

export default function PostContent({ content }: { content: AnyJson }) {
  if (!content) return null;

  if (isTinyHtml(content)) {
    const normalized = normalizeTinyMce(content.html || "");
    // Garanta que seu sanitize NÃO remova 'class', 'id', 'target', 'rel'
    const clean = sanitizeHtml(normalized, {
      allowedAttributes: {
        "*": ["href", "src", "alt", "title", "class", "id", "target", "rel"],
      },
    });

    return (
      <article className="tinymce-content">
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: clean }} />
      </article>
    );
  }

  // Fallback debug
  return (
    <pre className="text-xs whitespace-pre-wrap break-words bg-muted/30 p-4 rounded-xl">
      {JSON.stringify(content, null, 2)}
    </pre>
  );
}
