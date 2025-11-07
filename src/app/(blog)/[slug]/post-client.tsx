"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import PostMeta from "@/components/post-meta";
import PostContent from "@/components/post-content";
import AuthorCard from "./components/author-card";
import { SuggestedPostsFooter } from "@/components/related-posts-footer";

// carrega os componentes que dependem de browser
const ShareButtons = dynamic(() => import("@/components/share-buttons"), {
  ssr: false,
});
const TrackPostView = dynamic(() => import("@/components/track-post-view"), {
  ssr: false,
});
const SuggestedPosts = dynamic(
  () => import("@/components/related-posts").then((m) => m.SuggestedPosts),
  { ssr: false }
);

export function PostClient({
  post,
  canonicalUrl,
}: {
  post: any;
  canonicalUrl: string;
}) {
  return (
    <article className="min-h-screen w-full bg-gradient-to-br from-background via-secondary/10 to-background">
      <TrackPostView slug={post.slug} />

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
                {post.categories.map((c: any) => (
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
              authorUsername={post.author?.username}
              hasAvatar={post.author?.hasAvatar}
              publishedAt={post.publishedAt ?? post.createdAt}
              readTime={post.readTime}
            />

            <div className="pt-4">
              <ShareButtons
                title={post.title}
                url={canonicalUrl}
                summary={
                  post.excerpt ??
                  "Artigo publicado no blog Certifica Engenharia."
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* CONTEÚDO + SIDEBAR */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <PostContent content={post.content} />
            {post.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((t: any) => (
                  <Badge key={t.id} variant="outline">
                    #{t.name}
                  </Badge>
                ))}
              </div>
            ) : null}
            <div className="mt-12 p-8 bg-card border border-border rounded-lg">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Gostou deste conteúdo?
              </h3>
              <p className="text-muted-foreground mb-6">
                Compartilhe este post com seus amigos e colegas nas redes
                sociais
              </p>
              <div className="-mt-2">
                <ShareButtons
                  title={post.title}
                  url={canonicalUrl}
                  summary={
                    post.excerpt ??
                    "Artigo publicado no blog Certifica Engenharia."
                  }
                />
              </div>
            </div>
            <SuggestedPostsFooter identifier={post.id} />
          </div>

          <aside className="sticky space-y-6 top-24 ">
            <AuthorCard author={post.author} />

            <SuggestedPosts identifier={post.id} />
          </aside>
        </div>
      </section>
    </article>
  );
}
