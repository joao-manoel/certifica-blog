import React from "react";

export type PMNode = {
  type: string;
  content?: PMNode[];
  text?: string;
  marks?: { type: string }[];
  attrs?: any;
};
export type TiptapDoc = { type: "doc"; content?: PMNode[] };

export function isTipTap(v: any): v is TiptapDoc {
  return (
    v && typeof v === "object" && v.type === "doc" && Array.isArray(v.content)
  );
}

export function collectText(n: PMNode): string {
  if (n.type === "text") return n.text ?? "";
  return (n.content ?? []).map(collectText).join("");
}

/**
 * Cria <h1..h6> sem depender de JSX.IntrinsicElements e com suporte a `key`.
 * `key` vem separado porque não pertence a HTMLAttributes no tipo de React.
 */
export function renderHeading(
  level: number,
  props: React.HTMLAttributes<HTMLHeadingElement>,
  children?: React.ReactNode,
  key?: React.Key
) {
  const safe = Math.min(Math.max(Number(level || 2), 1), 6);
  const tag = `h${safe}` as keyof HTMLElementTagNameMap;
  return React.createElement(tag, { ...props, key }, children);
}
