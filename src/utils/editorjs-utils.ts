export type EditorJsBlock = { type: string; data: any };
export type EditorJs = {
  blocks: EditorJsBlock[];
  time?: number;
  version?: string;
};

export function isEditorJs(v: any): v is EditorJs {
  return v && typeof v === "object" && Array.isArray(v.blocks);
}
