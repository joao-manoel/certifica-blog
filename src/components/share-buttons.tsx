"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Link as LinkIcon, Facebook, Twitter } from "lucide-react";
import { SocialIcon } from "react-social-icons";

type Props = {
  title: string;
  url: string; 
  summary?: string;
};

export default function ShareButtons({ title, url, summary }: Props) {
  const [copied, setCopied] = useState(false);
  const shareSupported = typeof navigator !== "undefined" && !!navigator.share;

  // Helper para adicionar parâmetros UTM
  const withUtm = useCallback((base: string, source: string) => {
    const u = new URL(base);
    u.searchParams.set("utm_source", source);
    u.searchParams.set("utm_medium", "social");
    u.searchParams.set("utm_campaign", "post_share");
    return u.toString();
  }, []);

  const encoded = useMemo(() => {
    const whatsappUrl = withUtm(url, "whatsapp");
    const twitterUrl = withUtm(url, "x");
    const facebookUrl = withUtm(url, "facebook");
    return {
      t: encodeURIComponent(title),
      s: encodeURIComponent(summary ?? ""),
      whatsappUrl: encodeURIComponent(whatsappUrl),
      twitterUrl: encodeURIComponent(twitterUrl),
      facebookUrl: encodeURIComponent(facebookUrl),
    };
  }, [title, url, summary, withUtm]);

  const handleWebShare = useCallback(async () => {
    if (!shareSupported) return;
    try {
      await navigator.share({
        title,
        text: summary ?? title,
        url: withUtm(url, "webshare"),
      });
    } catch {
      /* usuário cancelou */
    }
  }, [shareSupported, title, summary, url, withUtm]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(withUtm(url, "copy"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = withUtm(url, "copy");
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [url, withUtm]);

  // URLs com UTM
  const whatsappHref = `https://wa.me/?text=${encoded.t}%20${encoded.whatsappUrl}`;
  const twitterHref = `https://twitter.com/intent/tweet?text=${encoded.t}&url=${encoded.twitterUrl}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encoded.facebookUrl}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {shareSupported && (
        <Button
          size="sm"
          variant="default"
          onClick={handleWebShare}
          aria-label="Compartilhar"
          className="gap-2 cursor-pointer"
        >
          <Share2 className="h-4 w-4" />
          Compartilhar
        </Button>
      )}

      <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
        <Button size="sm" variant="outline" className="gap-2 cursor-pointer">
          <img src="/images/whatsapp-icon.png" className="size-4" />
          WhatsApp
        </Button>
      </a>

      <a href={twitterHref} target="_blank" rel="noopener noreferrer">
        <Button size="sm" variant="outline" className="gap-2 cursor-pointer">
          <Twitter className="h-4 w-4" />X (Twitter)
        </Button>
      </a>

      <a href={facebookHref} target="_blank" rel="noopener noreferrer">
        <Button size="sm" variant="outline" className="gap-2 cursor-pointer">
          <Facebook className="h-4 w-4" />
          Facebook
        </Button>
      </a>

      <Button
        size="sm"
        variant="ghost"
        onClick={handleCopy}
        aria-label="Copiar link"
        className="gap-2 cursor-pointer"
      >
        <LinkIcon className="h-4 w-4" />
        {copied ? "Link copiado!" : "Copiar link"}
      </Button>
    </div>
  );
}
