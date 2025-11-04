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

type Props = { categories: string[] };

export default function PostsGrid({ categories }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [page, setPage] = useState(1);
  const perPage = 9;

  // PostsGrid (apenas trechos alterados)
  const q = useDebounce(searchTerm.trim(), 350);
  const hasSearch = q.length >= 2; // mesmo limiar do hook

  const baseParams = useMemo(
    () => ({ page, pageSize: perPage, sort: "publishedAt" } as const),
    [page, perPage]
  );

  // listagem: só quando NÃO há busca
  const {
    data: listData,
    isPending: isListPending,
    isError: isListError,
    error: listError,
    refetch: refetchList,
    isRefetching: isListRefetching,
  } = usePostsQuery(baseParams); // <--- desabilita

  // busca
  const searchParams = useMemo(() => {
    if (!hasSearch) return null;
    return {
      q,
      page,
      pageSize: perPage,
      sort: "relevance", // nada de ":desc"
    } as const;
  }, [hasSearch, q, page, perPage]);

  const {
    data: searchData,
    isPending: isSearchPending,
    isError: isSearchError,
    error: searchError,
    refetch: refetchSearch,
    isRefetching: isSearchRefetching,
  } = useSearchPostsQuery(searchParams);

  // qual fonte usar?
  const data = hasSearch ? searchData : listData;
  const isPending = hasSearch ? isSearchPending : isListPending;
  const isError = hasSearch ? isSearchError : isListError;
  const error = (hasSearch ? searchError : listError) as Error | undefined;
  const refetch = hasSearch ? refetchSearch : refetchList;
  const isRefetching = hasSearch ? isSearchRefetching : isListRefetching;

  // animação
  const searchAnimation = useScrollAnimation();

  // paginação
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
                if (page !== 1) setPage(1); // volta página
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

/* ---------- Helpers/UI ---------- */

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function SkeletonGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-48 w-full rounded-xl bg-muted/50 mb-4" />
          <div className="h-5 w-3/4 rounded bg-muted/50 mb-2" />
          <div className="h-4 w-full rounded bg-muted/50 mb-2" />
          <div className="h-4 w-2/3 rounded bg-muted/50" />
        </div>
      ))}
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
  isLoading,
}: {
  message?: string;
  onRetry: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="text-center py-12 space-y-4">
      <p className="text-red-500">
        Falha ao carregar posts{message ? `: ${message}` : ""}
      </p>
      <Button variant="outline" onClick={onRetry} disabled={isLoading}>
        Tentar novamente
      </Button>
    </div>
  );
}
