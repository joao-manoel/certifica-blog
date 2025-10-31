export type TinyHtmlPayload = {
  format: "html";
  html: string;
  version?: number;
};

export function isTinyHtml(v: any): v is TinyHtmlPayload {
  return (
    v &&
    typeof v === "object" &&
    v.format === "html" &&
    typeof v.html === "string"
  );
}
