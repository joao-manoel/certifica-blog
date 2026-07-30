"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import RelatedPostCard from "@/app/(blog)/[slug]/components/related-post-card";
import { getRelatedPosts } from "@/http/get-related-post";

export function SuggestedPostsFooter({
  identifier,
  limit = 3,
}: {
  identifier: string;
  limit?: number;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts", "related", identifier, limit],
    queryFn: async () =>
      (
        await getRelatedPosts({
          identifier,
          limit,
        })
      ).related,
    enabled: Boolean(identifier),
    staleTime: 60_000,
  });

  const items = data ?? [];

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--article-support)]/70">
            Continue explorando
          </p>
          <h2 className="mt-2 font-oswald text-3xl font-bold uppercase text-[var(--article-heading)]">
            Artigos relacionados
          </h2>
        </div>
        <Link
          href="/"
          className="hidden text-sm font-semibold text-[var(--article-accent)] hover:underline sm:block"
        >
          Ver todos
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-7 md:grid-cols-3" aria-busy="true">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[16/10] rounded-2xl bg-[#e2e6de]" />
              <div className="mt-5 h-3 w-24 rounded bg-[#e2e6de]" />
              <div className="mt-3 h-6 w-full rounded bg-[#e2e6de]" />
            </div>
          ))}
        </div>
      ) : null}

      {isError ? (
        <p className="rounded-xl border border-[#e3c2b4] bg-[#fff6f1] p-4 text-sm text-[#7a4936]">
          Não foi possível carregar os artigos relacionados agora.
        </p>
      ) : null}

      {items.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-3">
          {items.map((post) => (
            <RelatedPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : null}

      {!isLoading && !isError && items.length === 0 ? (
        <p className="text-sm text-[#626a62]">
          Não encontramos artigos relacionados.{" "}
          <Link href="/" className="font-semibold text-[var(--article-accent)]">
            Explore os conteúdos mais recentes.
          </Link>
        </p>
      ) : null}
    </div>
  );
}
