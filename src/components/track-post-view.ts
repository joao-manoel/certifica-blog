// src/components/track-post-view.tsx
"use client";

import { useEffect } from "react";
import { dailyFingerprint } from "@/utils/fingerprint";
import { trackPostView } from "@/http/track-post-view";

type Props = { slug: string };

export default function TrackPostView({ slug }: Props) {
  useEffect(() => {
    let aborted = false;

    (async () => {
      const fp = await dailyFingerprint();
      if (aborted) return;
      // dispara via HTTP helper (usa api-client, base URL e headers já padronizados)
      await trackPostView(slug, fp || undefined);
    })();

    return () => {
      aborted = true;
    };
  }, [slug]);

  return null;
}
