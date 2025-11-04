import type { CreateUtmEventPayload } from "@/http/create-utm-event";

export function collectUtmEventData(): CreateUtmEventPayload | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const source = params.get("utm_source") ?? "";
  const medium = params.get("utm_medium") ?? "";
  const campaign = params.get("utm_campaign") ?? "";

  // Se não houver as 3 principais, não gera evento
  if (!source || !medium || !campaign) return null;

  const term = params.get("utm_term") ?? undefined;
  const content = params.get("utm_content") ?? undefined;

  const referrer = document.referrer || undefined;
  const landingUrl = window.location.href;
  const ua = navigator.userAgent || "";

  let device = "desktop";
  if (/mobile/i.test(ua)) device = "mobile";
  else if (/tablet/i.test(ua)) device = "tablet";

  const browser = (() => {
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Edge")) return "Edge";
    return "Other";
  })();

  const os = (() => {
    if (/Windows/i.test(ua)) return "Windows";
    if (/Mac/i.test(ua)) return "MacOS";
    if (/Linux/i.test(ua)) return "Linux";
    if (/Android/i.test(ua)) return "Android";
    if (/iPhone|iPad|iOS/i.test(ua)) return "iOS";
    return "Unknown";
  })();

  // país pode ser inferido futuramente via backend
  return {
    source,
    medium,
    campaign,
    term,
    content,
    referrer,
    landingUrl,
    device,
    browser,
    os,
  };
}
