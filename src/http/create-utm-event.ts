import { api } from "./api-client";

export interface CreateUtmEventPayload {
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
  referrer?: string;
  landingUrl?: string;
  device?: string;
  browser?: string;
  os?: string;
  country?: string;
}

export async function createUtmEvent(
  data: CreateUtmEventPayload
): Promise<void> {
  await api
    .post("analytics/utm/create-utm-event", {
      json: data,
      next: { revalidate: 0 }, // evita cache
    })
    .catch(() => {
      // falha silenciosa — sem impacto no fluxo do usuário
    });
}
