import type {
  PostListItem,
  PostStatus,
  Visibility,
} from "@/@types/types-posts";
import { api } from "./api-client";
import { HTTPError } from "ky"; // se não exportar, importe de 'ky' diretamente

export interface SearchPostsParams {
  q: string;
  page?: number;
  perPage?: number;
  status?: PostStatus;
  visibility?: Visibility;
  categorySlug?: string;
  tagSlug?: string;
  authorId?: string;
  sort?: string;
}

export interface SearchPostsResponse {
  page: number;
  perPage: number;
  total: number;
  items: PostListItem[];
}

const EMPTY: SearchPostsResponse = { page: 1, perPage: 0, total: 0, items: [] };

export async function searchPosts(params: SearchPostsParams) {
  const sp = new URLSearchParams();
  sp.set("q", params.q);
  if (params.page != null) sp.set("page", String(params.page));
  if (params.perPage != null) sp.set("perPage", String(params.perPage));
  if (params.status) sp.set("status", params.status);
  if (params.visibility) sp.set("visibility", params.visibility);
  if (params.categorySlug) sp.set("category", params.categorySlug);
  if (params.tagSlug) sp.set("tag", params.tagSlug);
  if (params.authorId) sp.set("authorId", params.authorId);
  if (params.sort) sp.set("sort", params.sort);

  const url = `blog/posts/search?${sp.toString()}`;

  try {
    const res = await api.get(url, {
      next: { tags: ["posts", "search", params.q] },
    });
    // alguns backends devolvem 204 quando não há resultados
    if ((res as any).status === 204) return EMPTY;
    return (await res.json<SearchPostsResponse>()) ?? EMPTY;
  } catch (err) {
    if (err instanceof HTTPError) {
      const status = err.response?.status ?? 0;
      // trate 4xx “esperados” como resultado vazio
      if (status === 400 || status === 404 || status === 422) return EMPTY;
    }
    throw err; // 5xx continua como erro real
  }
}
