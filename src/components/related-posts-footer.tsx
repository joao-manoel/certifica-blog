"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getRelatedPosts } from "@/http/get-related-post";
import RelatedPostCard from "@/app/(blog)/[slug]/components/related-post-card";
import { normalizeAuthor } from "@/utils/normalize";
import type { PostListItem } from "@/@types/types-posts";

type SuggestedPostsProps = {
  identifier: string;
  limit?: number;
  includeScheduled?: boolean;
};

export function SuggestedPostsFooter({
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
      const items = (res.related ?? []).map((r: any) => {
        const post: Partial<PostListItem> = {
          id: r.id,
          title: r.title,
          slug: r.slug,
          coverUrl: r.coverUrl ?? null,
          publishedAt: r.publishedAt ?? null,
          author: normalizeAuthor(r.author),
        };
        return post as PostListItem;
      });
      return items;
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
      <h2 className="text-3xl font-bold text-foreground mb-8">
        Posts Relacionados
      </h2>

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

      {items.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((post) => (
            <RelatedPostCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      {emptyState && (
        <Card className="p-4 glass-strong">
          <p className="text-sm text-muted-foreground">
            Nenhum post relacionado foi encontrado. Confira os últimos
            publicados na página do blog.
          </p>
        </Card>
      )}
    </div>
  );
}
