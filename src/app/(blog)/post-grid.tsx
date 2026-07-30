"use client";

import {
  ArrowLeft,
  ArrowRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FeaturedPost } from "@/components/featured-post";
import PostCard from "@/components/post-card";
import { useDebounce } from "@/hooks/use-debounce";
import { usePostsQuery } from "@/hooks/use-posts-query";
import { usePublicCategoriesQuery } from "@/hooks/use-public-categories-query";
import { useSearchPostsQuery } from "@/hooks/use-search-posts-query";

import ErrorState from "./error-state";
import SkeletonGrid from "./skeleton-grid";

type Order = "recentes" | "antigos";

interface PostsGridProps {
  initialQuery: string;
  initialCategory: string;
  initialOrder: Order;
  initialPage: number;
}

export default function PostsGrid({
  initialQuery,
  initialCategory,
  initialOrder,
  initialPage,
}: PostsGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [order, setOrder] = useState<Order>(initialOrder);
  const [page, setPage] = useState(initialPage);
  const perPage = 12;

  const q = useDebounce(searchTerm.trim(), 300);
  const hasSearch = q.length > 0;

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (selectedCategory) params.set("categoria", selectedCategory);
    if (order === "antigos") params.set("ordem", order);
    if (page > 1) params.set("pagina", String(page));
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [order, page, pathname, q, router, selectedCategory]);

  const baseParams = useMemo(
    () =>
      ({
        page,
        pageSize: perPage,
        categorySlug: selectedCategory || undefined,
        orderBy: "publishedAt",
        orderDir: order === "antigos" ? "asc" : "desc",
      }) as const,
    [order, page, selectedCategory],
  );

  const listQuery = usePostsQuery(baseParams);
  const searchParams = useMemo(
    () =>
      hasSearch
        ? ({
            q,
            page,
            pageSize: perPage,
            sort: order === "antigos" ? "publishedAt" : "relevance",
            orderDir: order === "antigos" ? "asc" : "desc",
            categorySlug: selectedCategory || undefined,
          } as const)
        : null,
    [hasSearch, order, page, q, selectedCategory],
  );
  const searchQuery = useSearchPostsQuery(searchParams);
  const categoriesQuery = usePublicCategoriesQuery();

  const activeQuery = hasSearch ? searchQuery : listQuery;
  const data = activeQuery.data;
  const isInitialLoading = activeQuery.isPending && !data;
  const isUpdating = activeQuery.isFetching && !!data;
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const showFeatured =
    !hasSearch && !selectedCategory && page === 1 && !!data?.items[0];
  const gridItems = showFeatured ? data?.items.slice(1) ?? [] : data?.items ?? [];
  const selectedCategoryName = categoriesQuery.data?.find(
    (category) => category.slug === selectedCategory,
  )?.name;
  const hasActiveFilters = hasSearch || !!selectedCategory;

  function resetPage() {
    if (page !== 1) setPage(1);
  }

  function clearFilters() {
    setSearchTerm("");
    setSelectedCategory("");
    setOrder("recentes");
    setPage(1);
  }

  function goToPage(nextPage: number) {
    setPage(nextPage);
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      resultsRef.current?.focus({ preventScroll: true });
    });
  }

  const resultLabel = hasSearch
    ? `${total} ${total === 1 ? "resultado" : "resultados"} para “${q}”`
    : `${total} ${total === 1 ? "artigo" : "artigos"}`;

  return (
    <>
      <h1 className="sr-only">Blog Certifica</h1>
      <section className="px-5 pb-10 pt-32 sm:px-8 md:pb-14 md:pt-36 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 border-b border-[#dfe2d9] pb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <label
                htmlFor="blog-search"
                className="mb-3 block text-xs font-bold uppercase tracking-[0.22em] text-primary"
              >
                Encontre uma orientação
              </label>
              <div className="relative max-w-2xl">
                <Search
                  className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-primary/60"
                  aria-hidden="true"
                />
                <Input
                  id="blog-search"
                  type="search"
                  placeholder="Busque por tema, norma ou serviço"
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    resetPage();
                  }}
                  className="h-14 rounded-xl border-[#cfd4ca] bg-white pl-12 pr-12 text-base shadow-none focus-visible:border-primary"
                />
                {searchTerm ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      resetPage();
                    }}
                    className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-lg text-[#6d706b] hover:bg-[#eeefe9] hover:text-primary"
                    aria-label="Limpar busca"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            </div>

            <div>
              <label
                htmlFor="blog-order"
                className="mb-3 block text-xs font-bold uppercase tracking-[0.22em] text-primary"
              >
                Ordenar
              </label>
              <Select
                  value={order}
                  onValueChange={(value) => {
                    setOrder(value as Order);
                    resetPage();
                  }}
                >
                <SelectTrigger
                  id="blog-order"
                  className="h-14 min-w-52 rounded-xl border-[#cfd4ca] bg-white px-4 text-sm font-semibold text-primary shadow-none transition hover:border-primary focus-visible:border-primary focus-visible:ring-primary/20 data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/15"
                >
                  <span className="flex items-center gap-3">
                    <SlidersHorizontal
                      className="size-4 text-primary/60"
                      aria-hidden="true"
                    />
                    <SelectValue />
                  </span>
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  align="start"
                  className="min-w-[var(--radix-select-trigger-width)] rounded-xl border-[#d8ddd3] bg-white p-1.5 shadow-[0_18px_45px_rgba(29,61,50,0.16)]"
                >
                  <SelectItem
                    value="recentes"
                    className="min-h-11 cursor-pointer rounded-lg px-3 font-medium text-primary focus:bg-[#e8eee8] focus:text-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
                  >
                    Mais recentes
                  </SelectItem>
                  <SelectItem
                    value="antigos"
                    className="min-h-11 cursor-pointer rounded-lg px-3 font-medium text-primary focus:bg-[#e8eee8] focus:text-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
                  >
                    Mais antigos
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div
            className="scrollbar-none mt-6 flex gap-2 overflow-x-auto pb-2"
            aria-label="Filtrar por categoria"
          >
            <button
              type="button"
              aria-pressed={!selectedCategory}
              onClick={() => {
                setSelectedCategory("");
                resetPage();
              }}
              className="min-h-11 shrink-0 rounded-full border border-primary bg-primary px-5 text-sm font-semibold text-white transition aria-[pressed=false]:border-[#cfd4ca] aria-[pressed=false]:bg-transparent aria-[pressed=false]:text-primary hover:border-primary"
            >
              Todos
            </button>
            {categoriesQuery.data?.map((category) => (
              <button
                type="button"
                key={category.id}
                aria-pressed={selectedCategory === category.slug}
                aria-label={`${category.name}, ${category.postCount} ${
                  category.postCount === 1 ? "artigo" : "artigos"
                }`}
                onClick={() => {
                  setSelectedCategory(category.slug);
                  resetPage();
                }}
                className="min-h-11 shrink-0 rounded-full border border-[#cfd4ca] px-5 text-sm font-semibold text-primary transition hover:border-primary aria-[pressed=true]:border-primary aria-[pressed=true]:bg-primary aria-[pressed=true]:text-white"
              >
                {category.name}
                <span className="ml-2 text-xs opacity-65">{category.postCount}</span>
              </button>
            ))}
          </div>

          {categoriesQuery.isError ? (
            <p className="mt-3 text-sm text-[#6d706b]">
              As categorias não puderam ser carregadas agora. A busca continua
              disponível.
            </p>
          ) : null}
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {showFeatured && data?.items[0] ? (
            <div className="mb-16">
              <FeaturedPost post={data.items[0]} />
            </div>
          ) : null}

          <div
            ref={resultsRef}
            tabIndex={-1}
            className="scroll-mt-28 outline-none"
          >
            <div className="mb-8 flex flex-col gap-4 border-b border-[#dfe2d9] pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary/60">
                  Explore o conteúdo
                </p>
                <h2 className="mt-2 font-oswald text-3xl font-bold uppercase text-primary">
                  {resultLabel}
                </h2>
              </div>

              {hasActiveFilters ? (
                <div className="flex flex-wrap items-center gap-2">
                  {selectedCategoryName ? (
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("")}
                      className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#e5e8df] px-4 text-sm font-semibold text-primary"
                    >
                      {selectedCategoryName}
                      <X className="size-3.5" aria-hidden="true" />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="min-h-10 px-2 text-sm font-semibold text-secondary underline-offset-4 hover:underline"
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : null}
            </div>

            <div aria-live="polite" className="sr-only">
              {isUpdating ? "Atualizando resultados" : resultLabel}
            </div>

            {isInitialLoading ? (
              <SkeletonGrid showFeatured={!hasActiveFilters && page === 1} />
            ) : activeQuery.isError ? (
              <ErrorState
                message={activeQuery.error?.message}
                onRetry={() => activeQuery.refetch()}
                isLoading={activeQuery.isFetching}
              />
            ) : !data || data.items.length === 0 ? (
              <div className="rounded-3xl border border-[#dfe2d9] bg-[#eeefe9] px-6 py-16 text-center">
                <p className="font-oswald text-2xl font-bold uppercase text-primary">
                  Nenhum artigo encontrado
                </p>
                <p className="mx-auto mt-3 max-w-lg text-[#62655f]">
                  Tente outro termo ou remova os filtros para explorar todos os
                  conteúdos da Certifica.
                </p>
                <Button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 min-h-11 bg-secondary px-5 hover:bg-[#c96635]"
                >
                  Limpar filtros
                </Button>
              </div>
            ) : (
              <div
                className={`grid gap-x-7 gap-y-10 transition-opacity md:grid-cols-2 lg:grid-cols-3 ${
                  isUpdating ? "opacity-55" : "opacity-100"
                }`}
              >
                {gridItems.map((post, index) => (
                  <PostCard key={post.id} post={post} index={index} />
                ))}
              </div>
            )}

            {totalPages > 1 && !activeQuery.isError ? (
              <nav
                className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#dfe2d9] pt-7 sm:flex-row"
                aria-label="Paginação dos artigos"
              >
                <p className="text-sm text-[#6d706b]">
                  Página <strong className="text-primary">{page}</strong> de{" "}
                  {totalPages}
                </p>
                <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={() => goToPage(Math.max(1, page - 1))}
                    disabled={page <= 1 || activeQuery.isFetching}
                    className="min-h-11 border-[#cfd4ca] bg-transparent px-5"
                  >
                    <ArrowLeft aria-hidden="true" />
                    Anterior
                  </Button>
                  <Button
                    onClick={() => goToPage(Math.min(totalPages, page + 1))}
                    disabled={page >= totalPages || activeQuery.isFetching}
                    className="min-h-11 bg-primary px-5"
                  >
                    Próxima
                    <ArrowRight aria-hidden="true" />
                  </Button>
                </div>
              </nav>
            ) : null}
          </div>
        </div>
      </section>

      <section className="border-t border-primary/15 bg-primary px-5 py-14 text-white sm:px-8 md:py-20 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">
              Precisa aplicar esse conhecimento?
            </p>
            <h2 className="mt-4 max-w-3xl font-oswald text-4xl font-bold uppercase leading-tight sm:text-5xl">
              Leve seu imóvel para o próximo passo com orientação técnica.
            </h2>
          </div>
          <a
            href="https://www.certifica.eng.br/orcamento"
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg bg-secondary px-6 font-bold text-white transition-colors hover:bg-[#c96635] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Solicitar orçamento
          </a>
        </div>
      </section>
    </>
  );
}
