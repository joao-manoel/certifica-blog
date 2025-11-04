export async function sha256Hex(s: string) {
  const enc = new TextEncoder();
  const data = enc.encode(s);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function dailyFingerprint(): Promise<string> {
  try {
    const ua = navigator.userAgent ?? "";
    let sid = localStorage.getItem("sess:id");
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem("sess:id", sid);
    }
    const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
    return sha256Hex(`${sid}::${ua}::${day}`);
  } catch {
    // sem webcrypto/localStorage → volta "", servidor usa fallback
    return "";
  }
}
