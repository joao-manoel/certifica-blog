import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { getPost } from "@/http/get-post";
import PostContent from "@/components/post-content";
import PostMeta from "@/components/post-meta";
import { Badge } from "@/components/ui/badge";
import { AdPlaceholder } from "@/components/ads-placeholder";
import { SuggestedPosts } from "@/components/related-posts";
import TrackPostView from "@/components/track-post-view";

export const revalidate = 0; // força metadata sempre atualizado
export const dynamic = "force-dynamic"; // importante p/ SSR do metadata

type Params = { slug: string };

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug).catch(() => null);
  if (!post) return { title: "Post não encontrado" };

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://certifica.eng.br";
  const cover = post.coverUrl
    ? post.coverUrl.startsWith("http")
      ? post.coverUrl
      : `${baseUrl}${post.coverUrl}`
    : undefined;

  const title = post.title;
  const description =
    post.excerpt ?? "Artigo publicado no blog Certifica Engenharia.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${baseUrl}/blog/${slug}`,
      images: cover
        ? [{ url: cover, width: 1200, height: 630, alt: title }]
        : undefined,
    },
    twitter: {
      card: cover ? "summary_large_image" : "summary",
      title,
      description,
      images: cover ? [cover] : undefined,
    },
  };
}

export default async function PostPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const post = await getPost(slug).catch(() => null);
  if (!post) notFound();

  return (
    <article className="min-h-screen w-full bg-gradient-to-br from-background via-secondary/10 to-background">
      <TrackPostView slug={slug} />

      {/* HERO */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        {post.coverUrl ? (
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/60 to-background/10 backdrop-blur-[2px]" />

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl">
          <div className="backdrop-blur-md bg-background/60 border border-border/40 rounded-2xl p-6 md:p-8 shadow-lg">
            {post.categories?.length ? (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.categories.map((c) => (
                  <Badge
                    key={c.id}
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    {c.name}
                  </Badge>
                ))}
              </div>
            ) : null}

            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-foreground mb-4">
              {post.title}
            </h1>

            <PostMeta
              authorName={post.author?.name ?? "—"}
              publishedAt={post.publishedAt ?? post.createdAt}
              readTime={post.readTime}
            />
          </div>
        </div>
      </section>

      {/* CONTEÚDO + SIDEBAR */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <AdPlaceholder size="small" />
            <PostContent content={post.content} />
            {post.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <Badge key={t.id} variant="outline">
                    #{t.name}
                  </Badge>
                ))}
              </div>
            ) : null}
            <AdPlaceholder size="large" />
          </div>

          <aside className="space-y-6">
            <AdPlaceholder size="small" />
            <SuggestedPosts identifier={post.id} />
          </aside>
        </div>
      </section>
    </article>
  );
}
