import { isTinyHtml } from "@/utils/is-tiny-html-utils";
import { normalizeTinyMce, sanitizeHtml } from "@/utils/sanitize-html-utils";

export interface ArticleHeading {
  id: string;
  level: 2 | 3;
  text: string;
}

function normalizeInstagramEmbeds(html: string) {
  return html.replace(
    /<iframe[^>]*class=["']?instagram-media["']?[^>]*src=["']([^"']+)["'][^>]*><\/iframe>/gi,
    (original, src: string) => {
      try {
        const url = new URL(src);
        const permalink =
          url.origin +
          url.pathname.replace(/\/embed\/?$/, "").replace(/\/$/, "") +
          "/";
        return `<blockquote class="instagram-media" data-instgrm-permalink="${permalink}" data-instgrm-version="14"></blockquote>`;
      } catch {
        return original;
      }
    },
  );
}

function stripTags(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyHeading(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function prepareArticleContent(content: unknown) {
  if (!isTinyHtml(content)) {
    return { html: "", headings: [] as ArticleHeading[] };
  }

  const normalized = normalizeInstagramEmbeds(
    normalizeTinyMce(content.html || ""),
  );
  const clean = sanitizeHtml(normalized);

  const usedIds = new Map<string, number>();
  const headings: ArticleHeading[] = [];
  const html = clean.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (full, levelValue: string, attributes: string, innerHtml: string) => {
      const text = stripTags(innerHtml);
      if (!text) return full;

      const baseId = slugifyHeading(text) || `secao-${headings.length + 1}`;
      const count = usedIds.get(baseId) ?? 0;
      usedIds.set(baseId, count + 1);
      const id = count === 0 ? baseId : `${baseId}-${count + 1}`;
      const level = Number(levelValue) as 2 | 3;
      headings.push({ id, level, text });

      const attributesWithoutId = attributes.replace(
        /\s+id=(?:"[^"]*"|'[^']*')/gi,
        "",
      );
      return `<h${level}${attributesWithoutId} id="${id}">${innerHtml}</h${level}>`;
    },
  );

  return { html, headings };
}
