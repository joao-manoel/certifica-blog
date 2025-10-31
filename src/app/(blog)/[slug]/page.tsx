// app/(blog)/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { getPost } from "@/http/get-post";
import PostContent from "@/components/post-content";
import PostMeta from "@/components/post-meta";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

type Params = { slug: string };

// Next 16: params é Promise
export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  try {
    const post = await getPost(slug);
    const title = post.title;
    const description = post.excerpt ?? "";
    const cover = post.coverUrl ?? undefined;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        images: cover ? [{ url: cover }] : undefined,
      },
      twitter: {
        card: cover ? "summary_large_image" : "summary",
        title,
        description,
        images: cover ? [cover] : undefined,
      },
    };
  } catch {
    return { title: "Post", description: "" };
  }
}

export default async function PostPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params; // <-- desembrulha
  const post = await getPost(slug).catch(() => null);
  if (!post) notFound();

  return (
    <article className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <header className="px-4 pt-28 pb-8">
        <div className="container mx-auto max-w-3xl">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories?.map((c) => (
              <Badge
                key={c.id}
                className="bg-primary/10 text-primary border-primary/20"
              >
                {c.name}
              </Badge>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <PostMeta
            authorName={post.author?.name ?? "—"}
            publishedAt={post.publishedAt ?? post.createdAt}
            readTime={post.readTime}
          />
        </div>
      </header>

      {post.coverUrl && (
        <div className="relative h-[42vh] w-full">
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
      )}

      <section className="px-4 py-10">
        <div className="container mx-auto max-w-3xl prose prose-invert prose-headings:scroll-mt-24">
          <PostContent content={post.content} />
        </div>

        {post.tags?.length ? (
          <div className="container mx-auto max-w-3xl mt-10">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Badge key={t.id} variant="outline">
                  #{t.name}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </article>
  );
}
