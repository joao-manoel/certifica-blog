// hooks/use-search-posts-query.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { searchPosts, type SearchPostsParams } from "@/http/search-posts";

export function useSearchPostsQuery(params: SearchPostsParams | null) {
  const enabled = !!params?.q && params.q.trim().length >= 2; // exige 2+ chars

  return useQuery({
    queryKey: ["posts", "search", params],
    queryFn: () => {
      if (!params) throw new Error("missing params");
      return searchPosts(params);
    },
    enabled,
    staleTime: 30_000,
    // não fique re-tentando para 4xx
    retry(failureCount, error: any) {
      const status = error?.response?.status ?? 0;
      if (status >= 400 && status < 500) return false;
      return failureCount < 2;
    },
  });
}
