import { ArrowUpRight, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { RelatedPost } from "@/http/get-related-post";

function formatDate(dateISO: string | null) {
  if (!dateISO) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateISO));
}

export default function RelatedPostCard({ post }: { post: RelatedPost }) {
  return (
    <article className="group">
      <Link
        href={`/${post.slug}`}
        className="relative block aspect-[16/10] overflow-hidden rounded-2xl bg-[#e5e8df] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--article-accent)]"
        aria-label={`Ler artigo relacionado: ${post.title}`}
      >
        <Image
          src={post.coverUrl || "/images/placeholder.jpg"}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]"
        />
        <span className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full bg-[var(--article-accent)] text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </Link>

      <div className="pt-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--article-support)]/70">
          {post.author?.name ?? "Equipe Certifica"}
        </p>
        <h3 className="mt-2 font-oswald text-xl font-bold uppercase leading-tight text-[var(--article-heading)]">
          <Link
            href={`/${post.slug}`}
            className="transition-colors hover:text-[var(--article-accent)]"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#6a716a]">
          <CalendarDays className="size-3.5" aria-hidden="true" />
          {formatDate(post.publishedAt)}
        </p>
      </div>
    </article>
  );
}
