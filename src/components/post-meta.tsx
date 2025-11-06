"use client";

import { Calendar, Clock, User } from "lucide-react";

export default function PostMeta({
  authorName,
  hasAvatar,
  authorUsername,
  publishedAt,
  readTime,
}: {
  authorName: string;
  authorUsername: string;
  hasAvatar: boolean;
  publishedAt: string;
  readTime: number;
}) {
  const date = new Date(publishedAt);
  const fmt = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <span className="inline-flex items-center gap-1">
        {hasAvatar ? (
          <img
            src={`/api/users/avatar/${authorUsername}`}
            className="size-5 object-cover rounded-full"
          />
        ) : (
          <User size={14} />
        )}{" "}
        {authorName}
      </span>
      <span className="inline-flex items-center gap-1">
        <Calendar className="size-4" /> {fmt}
      </span>
      <span className="inline-flex items-center gap-1">
        <Clock className="size-4" /> Leia em {readTime} min
      </span>
    </div>
  );
}
