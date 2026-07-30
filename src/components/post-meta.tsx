"use client";

import { CalendarDays, Clock3 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function PostMeta({
  authorName,
  hasAvatar,
  authorUsername,
  publishedAt,
  readTime,
}: {
  authorName: string;
  authorUsername?: string;
  hasAvatar?: boolean;
  publishedAt: string;
  readTime: number;
}) {
  const date = new Date(publishedAt);
  const fmt = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const initials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[#626a62]">
      <span className="inline-flex items-center gap-2 font-medium text-[var(--article-heading)]">
        <Avatar className="size-8 border border-[#d8ddd3]">
          <AvatarImage
            src={hasAvatar ? `/api/users/avatar/${authorUsername}` : ""}
            alt=""
            className="object-cover"
          />
          <AvatarFallback className="bg-[#e8ece5] text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
        {authorName}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="size-4" aria-hidden="true" />
        {fmt}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock3 className="size-4" aria-hidden="true" />
        {readTime} min de leitura
      </span>
    </div>
  );
}
