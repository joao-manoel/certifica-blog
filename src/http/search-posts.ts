import type {
  PostListItem,
  PostStatus,
  Visibility,
} from "@/@types/types-posts";
import { api } from "./api-client";
import { HTTPError } from "ky";

export type Sort = "relevance" | "publishedAt" | "createdAt";

export interface SearchPostsParams {
  q: string;
  page?: number;
  /** compat: ainda aceito perPage, mas enviarei como pageSize */
  perPage?: number;
  /** preferível: use pageSize daqui pra frente */
  pageSize?: number;
  status?: PostStatus;
  visibility?: Visibility;
  categorySlug?: string;
  tagSlug?: string;
  authorId?: string;
  sort?: Sort | string; // aceito string e normalizo
}

export interface SearchPostsResponse {
  page: number;
  perPage: number; // mapeado de pageSize da API
  total: number;
  items: PostListItem[];
}

const EMPTY: SearchPostsResponse = { page: 1, perPage: 0, total: 0, items: [] };

function normalizeSort(v?: string): Sort {
  const s = (v ?? "").toLowerCase();
  if (s === "relevance") return "relevance";
  if (s === "createdat" || s === "created") return "createdAt";
  // default seguro
  return "publishedAt";
}

export async function searchPosts(params: SearchPostsParams) {
  const sp = new URLSearchParams();

  sp.set("q", params.q);

  if (params.page != null) sp.set("page", String(params.page));

  // envia SEMPRE pageSize (prioriza pageSize; fallback perPage)
  const pageSize = params.pageSize ?? params.perPage;
  if (pageSize != null) sp.set("pageSize", String(pageSize));

  if (params.status) sp.set("status", params.status);
  if (params.visibility) sp.set("visibility", params.visibility);
  if (params.categorySlug) sp.set("category", params.categorySlug);
  if (params.tagSlug) sp.set("tag", params.tagSlug);
  if (params.authorId) sp.set("authorId", params.authorId);

  // sort enum aceito pelo backend
  if (params.sort) sp.set("sort", normalizeSort(String(params.sort)));

  const url = `blog/posts/search?${sp.toString()}`;

  try {
    const res = await api.get(url, {
      // busca não deve ser cacheada; tags opcionais só poluem
      next: { revalidate: 0 },
    });

    if ((res as any).status === 204) return EMPTY;

    const data = await res.json<any>();

    // normaliza resposta (pageSize -> perPage) para o resto do app
    const perPageResp =
      typeof data?.pageSize === "number"
        ? data.pageSize
        : typeof data?.perPage === "number"
        ? data.perPage
        : 0;

    const items: PostListItem[] = Array.isArray(data?.items) ? data.items : [];

    return {
      page: typeof data?.page === "number" ? data.page : 1,
      perPage: perPageResp,
      total: typeof data?.total === "number" ? data.total : 0,
      items,
    } satisfies SearchPostsResponse;
  } catch (err) {
    if (err instanceof HTTPError) {
      const status = err.response?.status ?? 0;
      if (status === 400 || status === 404 || status === 422) return EMPTY;
    }
    throw err;
  }
}
