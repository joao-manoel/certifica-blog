"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    function updateProgress() {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const next = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, next)));
      setShowTop(window.scrollY > 700);
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <>
      <div
        className="fixed left-0 top-0 z-[60] h-1 bg-[var(--article-accent)] transition-[width] duration-150"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-label="Progresso de leitura"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      />
      {showTop ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-5 right-5 z-40 grid size-11 place-items-center rounded-full bg-[var(--article-heading)] text-white shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--article-accent)] focus-visible:ring-offset-2"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </>
  );
}
