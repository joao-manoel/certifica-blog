"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ListenPostButtonProps = {
  title: string;
  excerpt?: string | null;
  content: unknown;
};

type SpeechStatus = "idle" | "playing" | "paused";

function getContentText(content: unknown) {
  if (typeof content === "string") return stripHtml(content);

  if (
    content &&
    typeof content === "object" &&
    "html" in content &&
    typeof content.html === "string"
  ) {
    return stripHtml(content.html);
  }

  return "";
}

function stripHtml(html: string) {
  if (typeof window === "undefined") return html;

  const doc = new DOMParser().parseFromString(html, "text/html");
  doc
    .querySelectorAll(
      [
        "audio",
        "canvas",
        "code",
        "figcaption",
        "figure",
        "iframe",
        "img",
        "noscript",
        "picture",
        "pre",
        "script",
        "source",
        "style",
        "svg",
        "video",
      ].join(","),
    )
    .forEach((node) => node.remove());

  return Array.from(
    doc.body.querySelectorAll("h1, h2, h3, h4, h5, h6, p, li, blockquote"),
  )
    .map((node) => node.textContent?.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(". ");
}

function splitIntoChunks(text: string, maxLength = 1200) {
  const sentences = text.match(/[^.!?;:]+[.!?;:]?|[^.!?;:]+$/g) ?? [text];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const next = `${current} ${sentence}`.trim();

    if (next.length <= maxLength) {
      current = next;
      continue;
    }

    if (current) chunks.push(current);
    current = sentence.trim();
  }

  if (current) chunks.push(current);
  return chunks;
}

function getPortugueseVoice() {
  const voices = window.speechSynthesis.getVoices();

  return (
    voices.find((voice) => voice.lang.toLowerCase() === "pt-br") ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("pt")) ??
    null
  );
}

function estimateDurationSeconds(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 160;

  return Math.max(1, Math.ceil((words / wordsPerMinute) * 60));
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function ListenPostButton({
  title,
  excerpt,
  content,
}: ListenPostButtonProps) {
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const chunksRef = useRef<string[]>([]);
  const chunkIndexRef = useRef(0);
  const shouldStopRef = useRef(false);

  const textToRead = useMemo(() => {
    const parts = [title, excerpt, getContentText(content)].filter(Boolean);
    return parts.join(". ");
  }, [title, excerpt, content]);

  const totalSeconds = useMemo(
    () => estimateDurationSeconds(textToRead),
    [textToRead],
  );
  const progress = Math.min((elapsedSeconds / totalSeconds) * 100, 100);

  function stop() {
    shouldStopRef.current = true;
    window.speechSynthesis.cancel();
    chunkIndexRef.current = 0;
    setElapsedSeconds(0);
    setStatus("idle");
  }

  function speakChunk() {
    const chunk = chunksRef.current[chunkIndexRef.current];

    if (!chunk) {
      chunkIndexRef.current = 0;
      setElapsedSeconds(0);
      setStatus("idle");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunk);
    const voice = getPortugueseVoice();

    utterance.lang = voice?.lang ?? "pt-BR";
    utterance.voice = voice;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => {
      if (shouldStopRef.current) return;

      chunkIndexRef.current += 1;
      speakChunk();
    };
    utterance.onerror = () => {
      chunkIndexRef.current = 0;
      setElapsedSeconds(0);
      setStatus("idle");
    };

    window.speechSynthesis.speak(utterance);
    setStatus("playing");
  }

  function start() {
    if (!textToRead.trim()) return;

    window.speechSynthesis.cancel();
    shouldStopRef.current = false;
    chunksRef.current = splitIntoChunks(textToRead);
    chunkIndexRef.current = 0;
    setElapsedSeconds(0);
    speakChunk();
  }

  function toggle() {
    if (status === "playing") {
      window.speechSynthesis.pause();
      setStatus("paused");
      return;
    }

    if (status === "paused") {
      window.speechSynthesis.resume();
      setStatus("playing");
      return;
    }

    start();
  }

  useEffect(() => {
    return () => {
      shouldStopRef.current = true;
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (status !== "playing") return;

    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => Math.min(current + 1, totalSeconds));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [status, totalSeconds]);

  const isSupported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;

  if (!isSupported) return null;

  return (
    <div className="w-full md:min-w-[28rem]">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={toggle}
          className="min-h-11 cursor-pointer gap-2 border-[#d8ddd3] bg-white text-[var(--article-heading)] hover:bg-[var(--article-surface)]"
          aria-label={status === "playing" ? "Pausar leitura" : "Ouvir artigo"}
        >
          {status === "playing" ? (
            <Pause className="h-4 w-4" />
          ) : status === "paused" ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {status === "playing"
            ? "Pausar"
            : status === "paused"
              ? "Continuar"
              : "Ouvir artigo"}
        </Button>

        {status !== "idle" ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={stop}
            className="min-h-11 cursor-pointer gap-2"
            aria-label="Parar leitura"
          >
            <RotateCcw className="h-4 w-4" />
            Parar
          </Button>
        ) : null}

        <div className="ml-auto text-xs font-medium text-[#687068]">
          {formatTime(elapsedSeconds)} / {formatTime(totalSeconds)}
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-[#e2e6de]"
          role="progressbar"
          aria-label="Progresso da leitura"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <div
            className="h-full rounded-full bg-[var(--article-accent)] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
