"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getRelatedPosts } from "@/http/get-related-post";

type SuggestedPostsProps = {
  identifier: string; // slug ou UUID do post base
  limit?: number;
  includeScheduled?: boolean;
};

function formatDate(dateISO: string | null) {
  if (!dateISO) return null;
  try {
    const date = new Date(dateISO);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return null;
  }
}

export function SuggestedPosts({
  identifier,
  limit = 4,
  includeScheduled = false,
}: SuggestedPostsProps) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts", "related", identifier, limit, includeScheduled],
    queryFn: async () => {
      const res = await getRelatedPosts({
        identifier,
        limit,
        includeScheduled,
      });
      return res.related;
    },
    enabled: !!identifier,
    staleTime: 60_000,
  });

  const items = data ?? [];

  const emptyState = useMemo(
    () => !isLoading && !isError && items.length === 0,
    [isLoading, isError, items.length]
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground mb-4">
        Posts Sugeridos
      </h3>

      {isLoading && (
        <Card className="p-4 glass-strong">
          <div className="h-4 w-40 mb-3 bg-muted/50 rounded animate-pulse" />
          <div className="h-24 w-full bg-muted/30 rounded animate-pulse" />
        </Card>
      )}

      {isError && (
        <Card className="p-4 glass-strong">
          <p className="text-sm text-destructive">
            Falha ao carregar sugestões
            {(error as Error)?.message ? `: ${(error as Error).message}` : "."}
          </p>
        </Card>
      )}

      {items.map((post) => {
        const dateLabel = formatDate(post.publishedAt);
        return (
          <Link key={post.id} href={`/${post.slug}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group glass-strong">
              <div className="relative h-32 overflow-hidden">
                {/* você pode trocar por <Image /> se preferir */}
                <img
                  src={post.coverUrl ?? "/images/placeholder-cover.jpg"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>
              <div className="p-4">
                {/* Não retornamos categoria na rota; usei o autor como meta leve */}
                <span className="text-xs text-accent font-semibold">
                  {post.author?.name ?? "—"}
                </span>

                <h4 className="font-semibold text-sm mt-1 mb-2 text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                  {post.title}
                </h4>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {dateLabel && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{dateLabel}</span>
                    </div>
                  )}

                  {/* A rota de relacionados não retorna readTime. Se quiser exibir,
                      altere a rota para incluir readTime ou calcule no front. */}
                  {/* {typeof post.readTime === "number" && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime} min</span>
                    </div>
                  )} */}
                </div>
              </div>
            </Card>
          </Link>
        );
      })}

      {emptyState && (
        <Card className="p-4 glass-strong">
          <p className="text-sm text-muted-foreground">
            Nenhum post relacionado foi encontrado. Confira os últimos
            publicados na página do blog.
          </p>
        </Card>
      )}

      <Link
        href="/"
        className="w-full cursor-pointer py-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors flex items-center justify-center gap-2 group"
      >
        Ver todos os posts
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
