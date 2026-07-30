"use client";

import { ArrowUpRight, CalendarDays, Clock3, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { PostListItem } from "@/@types/types-posts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fmtDate } from "@/utils/date-utils";

type PostCardProps = {
  post: PostListItem;
  index: number;
};

export default function PostCard({ post, index }: PostCardProps) {
  const initials = post.author?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <article
      className="group flex h-full flex-col"
      style={{ animationDelay: `${Math.min(index, 5) * 0.06}s` }}
    >
      <Link
        href={`/${post.slug}`}
        className="relative block aspect-[16/10] overflow-hidden rounded-2xl bg-[#e5e8df] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
        aria-label={`Ler: ${post.title}`}
      >
        <Image
          src={post.coverUrl ?? "/images/placeholder.jpg"}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={index < 2}
          className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]"
        />
        <span className="absolute bottom-4 right-4 grid size-11 place-items-center rounded-full bg-secondary text-white opacity-0 shadow-sm transition-all group-hover:opacity-100 group-focus-within:opacity-100">
          <ArrowUpRight className="size-5" aria-hidden="true" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col pt-5">
        {post.categories?.[0] ? (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary/65">
            {post.categories[0].name}
          </p>
        ) : null}

        <h3 className="font-oswald text-2xl font-bold uppercase leading-tight text-primary">
          <Link
            href={`/${post.slug}`}
            className="transition-colors hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
          >
            {post.title}
          </Link>
        </h3>

        {post.excerpt ? (
          <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-[#62655f]">
            {post.excerpt}
          </p>
        ) : null}

        <div className="mt-auto pt-6">
          <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-[#dfe2d9] pt-4 text-xs text-[#70736d]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              {fmtDate(post.publishedAt ?? post.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-3.5" aria-hidden="true" />
              {post.readTime} min
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2.5 text-sm font-medium text-primary">
            {post.author?.hasAvatar ? (
              <Avatar className="size-8 border border-[#dfe2d9]">
                <AvatarImage
                  src={`/api/users/avatar/${post.author.username}`}
                  alt=""
                  className="object-cover"
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            ) : (
              <span className="grid size-8 place-items-center rounded-full bg-[#e5e8df]">
                <User className="size-4" aria-hidden="true" />
              </span>
            )}
            <span>{post.author?.name ?? "Equipe Certifica"}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
