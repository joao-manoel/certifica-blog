export type TinyHtmlPayload = {
  format: "html";
  html: string;
  version?: number;
};

export function isTinyHtml(v: unknown): v is TinyHtmlPayload {
  return (
    typeof v === "object" &&
    v !== null &&
    "format" in v &&
    "html" in v &&
    v.format === "html" &&
    typeof v.html === "string"
  );
}
