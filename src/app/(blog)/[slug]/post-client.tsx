"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

import type { PostDetail } from "@/@types/types-posts";
import { ArticleToc } from "@/components/article-toc";
import PostContent from "@/components/post-content";
import PostMeta from "@/components/post-meta";
import { ReadingProgress } from "@/components/reading-progress";
import { SuggestedPostsFooter } from "@/components/related-posts-footer";
import ShareButtons from "@/components/share-buttons";

import AuthorCard from "./components/author-card";

const ListenPostButton = dynamic(
  () =>
    import("@/components/listen-post-button").then((module) => module.ListenPostButton),
  { ssr: false },
);
const TrackPostView = dynamic(() => import("@/components/track-post-view"), {
  ssr: false,
});

function getContextualCta(post: PostDetail) {
  const category = post.categories?.[0]?.slug ?? "";

  if (category.includes("regularizacao")) {
    return {
      eyebrow: "Regularize com segurança",
      title: "Precisa entender a situação do seu imóvel?",
      text: "A Certifica avalia a documentação e indica o caminho técnico para a regularização.",
      label: "Solicitar diagnóstico",
    };
  }

  if (category.includes("laudo")) {
    return {
      eyebrow: "Decisão com respaldo",
      title: "Seu caso precisa de um laudo técnico?",
      text: "Converse com um especialista e receba orientação sobre escopo, documentos e próximos passos.",
      label: "Falar com especialista",
    };
  }

  return {
    eyebrow: "Transforme informação em projeto",
    title: "Planejando construir, reformar ou projetar?",
    text: "Organize custos, decisões e documentação com acompanhamento técnico desde o início.",
    label: "Solicitar orçamento",
  };
}

export function PostClient({
  post,
  canonicalUrl,
}: {
  post: PostDetail;
  canonicalUrl: string;
}) {
  const cta = getContextualCta(post);

  return (
    <article className="article-page min-h-screen bg-[#f7f7f2] pt-20 md:pt-[100px]">
      <TrackPostView slug={post.slug} />
      <ReadingProgress />

      <header className="border-b border-[#dfe2d9] px-5 py-10 sm:px-8 md:py-14 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <nav
            aria-label="Navegação estrutural"
            className="mb-7 flex items-center gap-2 text-sm text-[#687068]"
          >
            <Link href="/" className="transition-colors hover:text-[var(--article-accent)]">
              Blog
            </Link>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <span className="line-clamp-1">
              {post.categories?.[0]?.name ?? "Artigo"}
            </span>
          </nav>

          {post.categories?.length ? (
            <div className="mb-5 flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <span
                  key={category.id}
                  className="rounded-full border border-[var(--article-line)]/60 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--article-support)]"
                >
                  {category.name}
                </span>
              ))}
            </div>
          ) : null}

          <h1 className="max-w-4xl font-oswald text-4xl font-bold uppercase leading-[1.04] tracking-[-0.02em] text-[var(--article-heading)] sm:text-5xl md:text-6xl">
            {post.title}
          </h1>

          {post.excerpt ? (
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#5f655f]">
              {post.excerpt}
            </p>
          ) : null}

          <div className="mt-7">
            <PostMeta
              authorName={post.author?.name ?? "Equipe Certifica"}
              authorUsername={post.author?.username}
              hasAvatar={post.author?.hasAvatar}
              publishedAt={post.publishedAt ?? post.createdAt}
              readTime={post.readTime}
            />
          </div>
        </div>
      </header>

      {post.coverUrl ? (
        <div className="px-5 pt-8 sm:px-8 lg:px-12">
          <div className="relative mx-auto aspect-[16/8] max-w-7xl overflow-hidden rounded-2xl bg-[#e5e8df] md:rounded-3xl">
            <Image
              src={post.coverUrl}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      <section
        aria-label="Ferramentas do artigo"
        className="px-5 py-7 sm:px-8 lg:px-12"
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-2xl border border-[#d8ddd3] bg-white p-4 md:flex-row md:items-center md:justify-between">
          <ListenPostButton
            title={post.title}
            excerpt={post.excerpt}
            content={post.content}
          />
          <ShareButtons
            compact
            title={post.title}
            url={canonicalUrl}
            summary={
              post.excerpt ?? "Artigo publicado no blog Certifica Engenharia."
            }
          />
        </div>
      </section>

      <div className="px-5 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <ArticleToc content={post.content} variant="mobile" />
          </div>

          <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,720px)_240px]">
            <main className="min-w-0">
              <PostContent content={post.content} />

              {post.tags?.length ? (
                <div className="mt-10 flex flex-wrap gap-2 border-t border-[#dfe2d9] pt-6">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full bg-[#e8ece5] px-3 py-1.5 text-sm text-[var(--article-support)]"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              ) : null}

              <section className="mt-12 overflow-hidden rounded-3xl bg-[var(--article-heading)] p-7 text-white sm:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/60">
                  {cta.eyebrow}
                </p>
                <h2 className="mt-4 font-oswald text-3xl font-bold uppercase leading-tight sm:text-4xl">
                  {cta.title}
                </h2>
                <p className="mt-4 max-w-xl leading-relaxed text-white/75">
                  {cta.text}
                </p>
                <a
                  href="https://www.certifica.eng.br/orcamento"
                  className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-lg bg-[var(--article-accent)] px-5 font-bold text-white transition-colors hover:bg-[#c96635] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {cta.label}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </section>

              <div className="mt-12">
                <AuthorCard author={post.author} />
              </div>
            </main>

            <aside className="sticky top-28">
              <ArticleToc content={post.content} variant="desktop" />
            </aside>
          </div>

          <section className="mt-20 border-t border-[#dfe2d9] pt-12">
            <SuggestedPostsFooter identifier={post.id} />
          </section>
        </div>
      </div>
    </article>
  );
}
