"use client";

import { useQuery } from "@tanstack/react-query";
import {
  listPosts,
  type ListPostsParams,
  type ListPostsResponse,
} from "@/http/list-posts";

export function usePostsQuery(params: ListPostsParams) {
  return useQuery<ListPostsResponse>({
    queryKey: ["posts", params],
    queryFn: () => listPosts(params),
  });
}
