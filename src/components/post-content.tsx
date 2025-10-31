// components/blog/post-content.tsx
"use client";
import "tinymce/skins/content/default/content.min.css"; // estilos do conteúdo

import { isTinyHtml } from "@/utils/is-tiny-html-utils";
import { sanitizeHtml } from "@/utils/sanitize-html-utils";

type AnyJson = unknown;

export default function PostContent({ content }: { content: AnyJson }) {
  if (!content) return null;

  if (isTinyHtml(content)) {
    const clean = sanitizeHtml(content.html);
    return (
      <div
        className="tinymce-content "
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    );
  }
  // 4) Fallback
  return (
    <pre className="text-xs whitespace-pre-wrap break-words bg-muted/30 p-4 rounded-xl ">
      {JSON.stringify(content, null, 2)}
    </pre>
  );
}
