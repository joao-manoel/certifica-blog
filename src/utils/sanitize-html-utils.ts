import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "span",
  "strong",
  "em",
  "u",
  "s",
  "ul",
  "ol",
  "li",
  "br",
  "hr",
  "blockquote",
  "code",
  "pre",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "figure",
  "figcaption",
  "img",
  "a",
];

const ALLOWED_ATTR = [
  // estilos/classes do Tiny
  "style",
  "class",
  // imagens/links
  "src",
  "alt",
  "title",
  "width",
  "height",
  "href",
  "target",
  "rel",
  // data-* que o Tiny grava
  "data-start",
  "data-end",
];

export function sanitizeHtml(html: string) {
  // Mantém style + data-attrs e limpa CSS perigoso
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: true,
    // Evita JS inline em href/src
    FORBID_ATTR: ["onerror", "onclick", "onload", "onmouseover"],
    // Opcional: força links seguros
    ADD_ATTR: [],
  });
}
