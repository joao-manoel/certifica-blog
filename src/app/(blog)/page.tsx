import PostsGrid from "./post-grid";

type BlogSearchParams = Promise<{
  q?: string;
  categoria?: string;
  ordem?: string;
  pagina?: string;
}>;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: BlogSearchParams;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[#f7f7f2]">
      <PostsGrid
        initialQuery={params.q ?? ""}
        initialCategory={params.categoria ?? ""}
        initialOrder={params.ordem === "antigos" ? "antigos" : "recentes"}
        initialPage={Math.max(1, Number(params.pagina) || 1)}
      />
    </main>
  );
}
