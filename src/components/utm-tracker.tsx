"use client";

import { useEffect } from "react";
import { createUtmEvent } from "@/http/create-utm-event";
import { collectUtmEventData } from "@/utils/utm-utils";

/**
 * Componente leve para registrar evento UTM automaticamente.
 * Pode ser colocado em `app/layout.tsx` (dentro de `<body>`).
 */
export function UtmTracker() {
  useEffect(() => {
    const data = collectUtmEventData();
    if (data) {
      createUtmEvent(data);
    }
  }, []);

  return null;
}
