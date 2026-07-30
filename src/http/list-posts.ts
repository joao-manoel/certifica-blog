import type {
  PostListItem,
  PostStatus,
  Visibility,
} from "@/@types/types-posts";
import { api } from "./api-client";

export interface ListPostsParams {
  page?: number;
  pageSize?: number;
  status?: PostStatus;
  visibility?: Visibility;
  categorySlug?: string;
  tagSlug?: string;
  authorId?: string;
  orderBy?: "createdAt" | "publishedAt";
  orderDir?: "asc" | "desc";
}

export interface ListPostsResponse {
  page: number;
  perPage: number;
  total: number;
  items: PostListItem[];
}

export async function listPosts(params: ListPostsParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.page != null) searchParams.set("page", String(params.page));
  if (params.pageSize != null)
    searchParams.set("pageSize", String(params.pageSize));
  if (params.status) searchParams.set("status", params.status);
  if (params.visibility) searchParams.set("visibility", params.visibility);
  if (params.categorySlug) searchParams.set("category", params.categorySlug);
  if (params.tagSlug) searchParams.set("tag", params.tagSlug);
  if (params.authorId) searchParams.set("authorId", params.authorId);
  if (params.orderBy) searchParams.set("orderBy", params.orderBy);
  if (params.orderDir) searchParams.set("orderDir", params.orderDir);

  const qs = searchParams.toString();
  const url = qs ? `blog/public/posts?${qs}` : "blog/public/posts";

  const data = await api
    .get(url, {
      next: { tags: ["posts"] },
    })
    .json<{
      page: number;
      pageSize: number;
      total: number;
      items: PostListItem[];
    }>();

  return {
    page: data.page,
    perPage: data.pageSize,
    total: data.total,
    items: data.items,
  } satisfies ListPostsResponse;
}
