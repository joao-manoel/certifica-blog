import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { PostListItem } from "@/@types/types-posts";
import { fmtDate } from "@/utils/date-utils";

export function FeaturedPost({ post }: { post: PostListItem }) {
  return (
    <article className="grid overflow-hidden rounded-[1.75rem] border border-[#dfe2d9] bg-[#eeefe9] lg:grid-cols-[1.15fr_0.85fr]">
      <Link
        href={`/${post.slug}`}
        className="group relative block min-h-72 overflow-hidden lg:min-h-[430px]"
        aria-label={`Ler artigo em destaque: ${post.title}`}
      >
        <Image
          src={post.coverUrl ?? "/images/placeholder.jpg"}
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.025]"
        />
      </Link>

      <div className="flex flex-col justify-between p-7 sm:p-9 lg:p-11">
        <div>
          <div className="mb-7 flex items-center gap-3">
            <span className="h-px w-9 bg-secondary" />
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
              Artigo em destaque
            </span>
          </div>

          {post.categories[0] ? (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary/65">
              {post.categories[0].name}
            </p>
          ) : null}

          <h2 className="font-oswald text-3xl font-bold uppercase leading-tight text-primary sm:text-4xl">
            <Link
              href={`/${post.slug}`}
              className="transition-colors hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            >
              {post.title}
            </Link>
          </h2>

          {post.excerpt ? (
            <p className="mt-5 line-clamp-3 text-base leading-relaxed text-[#5f615d]">
              {post.excerpt}
            </p>
          ) : null}
        </div>

        <div className="mt-9">
          <div className="mb-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#6d706b]">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="size-4" aria-hidden="true" />
              {fmtDate(post.publishedAt ?? post.createdAt)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="size-4" aria-hidden="true" />
              {post.readTime} min de leitura
            </span>
          </div>

          <Link
            href={`/${post.slug}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-secondary px-5 py-3 font-semibold text-white transition-colors hover:bg-[#c96635] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
          >
            Ler artigo
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
