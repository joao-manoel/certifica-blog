"use client";

import { useMemo, useState } from "react";
import { usePostsQuery } from "@/hooks/use-posts-query";
import { useSearchPostsQuery } from "@/hooks/use-search-posts-query";
import { useDebounce } from "@/hooks/use-debounce";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import PostCard from "@/components/post-card";
import SkeletonGrid from "./skeleton-grid";
import ErrorState from "./error-state";
import { slugify } from "@/utils/utils";

type Props = { categories: string[] };

export default function PostsGrid({ categories }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [page, setPage] = useState(1);
  const perPage = 9;

  const q = useDebounce(searchTerm.trim(), 350);
  const hasSearch = q.length >= 2;

  // ← mapeia "Todos" para undefined; demais viram slug
  const categorySlug = useMemo(
    () =>
      selectedCategory === "Todos" ? undefined : slugify(selectedCategory),
    [selectedCategory]
  );

  // LISTAGEM (sem q) — já inclui filtro por categoria
  const baseParams = useMemo(
    () =>
      ({
        page,
        pageSize: perPage,
        sort: "publishedAt",
        categorySlug, // ← aqui
      } as const),
    [page, perPage, categorySlug]
  );

  const {
    data: listData,
    isPending: isListPending,
    isError: isListError,
    error: listError,
    refetch: refetchList,
    isRefetching: isListRefetching,
  } = usePostsQuery(baseParams);

  // BUSCA (com q) — também passa categorySlug
  const searchParams = useMemo(() => {
    if (!hasSearch) return null;
    return {
      q,
      page,
      pageSize: perPage,
      sort: "relevance",
      categorySlug,
    } as const;
  }, [hasSearch, q, page, perPage, categorySlug]);

  const {
    data: searchData,
    isPending: isSearchPending,
    isError: isSearchError,
    error: searchError,
    refetch: refetchSearch,
    isRefetching: isSearchRefetching,
  } = useSearchPostsQuery(searchParams);

  // fonte de dados
  const data = hasSearch ? searchData : listData;
  const isPending = hasSearch ? isSearchPending : isListPending;
  const isError = hasSearch ? isSearchError : isListError;
  const error = (hasSearch ? searchError : listError) as Error | undefined;
  const refetch = hasSearch ? refetchSearch : refetchList;
  const isRefetching = hasSearch ? isSearchRefetching : isListRefetching;

  const searchAnimation = useScrollAnimation();

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="w-full">
      {/* Busca + Filtros */}
      <div
        ref={searchAnimation.ref}
        className={`mt-0 animate-on-scroll animate-fade-up ${
          searchAnimation.isVisible ? "animated" : ""
        }`}
      >
        <div className="glass-strong rounded-2xl p-6 max-w-3xl mx-auto">
          <div className="relative mb-6">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <Input
              type="text"
              placeholder="Buscar artigos..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (page !== 1) setPage(1);
              }}
              className="pl-10 bg-background/50"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedCategory(category);
                  if (page !== 1) setPage(1);
                }}
                className={
                  selectedCategory === category ? "" : "bg-background/50"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-8">
        {isPending ? (
          <SkeletonGrid />
        ) : isError ? (
          <ErrorState
            message={error?.message}
            onRetry={() => refetch()}
            isLoading={isRefetching}
          />
        ) : !data || data.items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhum artigo encontrado
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Paginação */}
      <div className="mt-10 flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1 || isPending}
        >
          Anterior
        </Button>
        <span className="text-sm text-muted-foreground">
          Página {page} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages || isPending}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
