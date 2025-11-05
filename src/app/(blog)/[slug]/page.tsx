// app/(blog)/[slug]/page.tsx
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Image from "next/image";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { getPost } from "@/http/get-post";
import PostContent from "@/components/post-content";
import PostMeta from "@/components/post-meta";
import { Badge } from "@/components/ui/badge";

export const revalidate = 0;

// Carregamento apenas no cliente (evita SSR de libs que tocam window/document)
const ShareButtons = dynamic(() => import("@/components/share-buttons"), {
  ssr: false,
});
const TrackPostView = dynamic(() => import("@/components/track-post-view"), {
  ssr: false,
});

type Params = { slug: string };

function isSocialBot(ua: string) {
  return /facebookexternalhit|WhatsApp|twitterbot|linkedinbot|Slackbot|TelegramBot|Discordbot/i.test(
    ua
  );
}

function absoluteUrl(pathOrUrl: string, base: URL) {
  return pathOrUrl.startsWith("http")
    ? pathOrUrl
    : new URL(pathOrUrl, base).toString();
}

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug).catch(() => null);
  if (!post) return { title: "Post não encontrado" };

  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.certifica.eng.br";
  const metadataBase = new URL(base);

  const title = post.title;
  const description =
    post.excerpt ?? "Artigo publicado no blog Certifica Engenharia.";

  // URL pública FINAL do post (sem /blog, para bater com seus links compartilhados)
  const path = `/${slug}`;
  const canonicalUrl = new URL(path, metadataBase).toString();

  // Prefira imagem hospedada no seu domínio; mantenha fallback local 1200x630 JPEG
  const coverAbs = post.coverUrl
    ? absoluteUrl(post.coverUrl, metadataBase)
    : undefined;
  const fallbackOg = new URL(
    "/images/placeholder.jpg",
    metadataBase
  ).toString(); // troque por /og/posts/<slug>.jpg
  const ogImage = coverAbs ?? fallbackOg;

  return {
    metadataBase,
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalUrl,
      siteName: "Certifica Engenharia",
      locale: "pt_BR",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PostPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const post = await getPost(slug).catch(() => null);
  if (!post) notFound();

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.certifica.eng.br";
  const metadataBase = new URL(baseUrl);
  const canonicalUrl = `${baseUrl}/${slug}`;

  const ua = (await headers()).get("user-agent") || "";
  const bot = isSocialBot(ua);

  // --- Renderização "bot-safe": sem client components, zero acessos a browser APIs ---
  if (bot) {
    const title = post.title;
    const description =
      post.excerpt ?? "Artigo publicado no blog Certifica Engenharia.";
    const coverAbs = post.coverUrl
      ? absoluteUrl(post.coverUrl, metadataBase)
      : undefined;
    const fallbackOg = new URL(
      "/images/placeholder.jpg",
      metadataBase
    ).toString();
    const ogImage = coverAbs ?? fallbackOg;

    return (
      <article>
        <h1>{title}</h1>
        <p>{description}</p>
        {/* Renderiza a mesma imagem do OG para bots que usam heurística visual */}
        <img
          src={ogImage}
          alt={title}
          width={1200}
          height={630}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </article>
    );
  }

  // --- Render normal para usuários humanos ---
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
                {post.tags.map((t) => (
                  <Badge key={t.id} variant="outline">
                    #{t.name}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>

          <aside className="space-y-6"></aside>
        </div>
      </section>
    </article>
  );
}
