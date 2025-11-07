import { api } from "./api-client";

export interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverUrl: string | null;
  publishedAt: string | null;
  author: {
    id: string;
    name: string;
    username: string;
  };
  score: number;
}

export interface GetRelatedPostsParams {
  identifier: string; // slug ou id do post-base
  limit?: number;
  includeScheduled?: boolean;
}

export interface GetRelatedPostsResponse {
  related: RelatedPost[];
}

/**
 * Busca posts relacionados com base em tags e categorias.
 * Fallback automático: retorna os últimos posts se nenhum relacionado for encontrado.
 */
export async function getRelatedPosts({
  identifier,
  limit,
  includeScheduled,
}: GetRelatedPostsParams): Promise<GetRelatedPostsResponse> {
  const searchParams = new URLSearchParams();

  if (limit != null) searchParams.set("limit", String(limit));
  if (includeScheduled) searchParams.set("includeScheduled", "true");

  const qs = searchParams.toString();
  const url = qs
    ? `blog/posts/${identifier}/related?${qs}`
    : `blog/posts/${identifier}/related`;

  const result = await api
    .get(url, {
      next: { tags: ["posts", "related-posts"] },
    })
    .json<GetRelatedPostsResponse>();

  return result;
}
