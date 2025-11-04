// hooks/use-search-posts-query.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { searchPosts, type SearchPostsParams } from "@/http/search-posts";

type Sort = "relevance" | "publishedAt" | "createdAt";

function normalizeSort(v?: string): Sort {
  const s = (v ?? "").toLowerCase();
  if (s === "relevance") return "relevance";
  if (s === "createdat" || s === "created") return "createdAt";
  return "publishedAt";
}

/**
 * Garante que o objeto enviado ao client HTTP esteja no formato da API:
 * - usa pageSize (cai para perPage se vier)
 * - normaliza sort
 */
function normalizeParams(params: SearchPostsParams) {
  const pageSize = params.pageSize ?? params.perPage ?? 10;
  return {
    ...params,
    page: params.page ?? 1,
    pageSize,
    sort: normalizeSort(params.sort as string | undefined),
  };
}

export function useSearchPostsQuery(params: SearchPostsParams | null) {
  // exige 2+ chars para disparar busca
  const enabled = !!params?.q && params.q.trim().length >= 2;

  // Atenção: a key inclui somente os campos relevantes para o request
  const queryKey = [
    "posts",
    "search",
    enabled
      ? {
          q: params!.q.trim(),
          page: params!.page ?? 1,
          pageSize: params!.pageSize ?? params!.perPage ?? 10,
          sort: normalizeSort(params!.sort as string | undefined),
          status: params!.status ?? undefined,
          visibility: params!.visibility ?? undefined,
          categorySlug: params!.categorySlug ?? undefined,
          tagSlug: params!.tagSlug ?? undefined,
          authorId: params!.authorId ?? undefined,
        }
      : "disabled",
  ] as const;

  return useQuery({
    queryKey,
    enabled,
    queryFn: async () => {
      if (!params) throw new Error("missing params");
      return searchPosts(normalizeParams(params));
    },
    // mantém dados anteriores enquanto pagina/filtra (v5)
    placeholderData: (prev) => prev,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry(failureCount, error: any) {
      const status = error?.response?.status ?? 0;
      if (status >= 400 && status < 500) return false;
      return failureCount < 2;
    },
  });
}
