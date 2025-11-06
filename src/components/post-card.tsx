"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import Image from "next/image";
import Link from "next/link";
import type { PostListItem } from "@/@types/types-posts";
import { fmtDate } from "@/utils/date-utils";

type PostCardProps = {
  post: PostListItem; // use seu tipo
  index: number;
};

export default function PostCard({ post, index }: PostCardProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`animate-on-scroll animate-scale ${
        isVisible ? "animated" : ""
      }`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <Card className="glass h-full hover:shadow-lg transition-all duration-300 group overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.coverUrl ?? "/images/placeholder.jpg"}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            priority={index < 3}
          />
          {post.categories?.[0]?.name && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary text-primary-foreground">
                {post.categories[0].name}
              </Badge>
            </div>
          )}
        </div>

        <CardHeader>
          <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
            <Link href={`/${post.slug}`}>{post.title}</Link>
          </CardTitle>
          {post.excerpt && (
            <CardDescription className="line-clamp-2">
              {post.excerpt}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{fmtDate(post.publishedAt ?? post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>Leia em {post.readTime} min</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {post.author?.hashAvatar ? (
                <img
                  src={`/api/users/avatar/${post.author.username}.jpg`}
                  className="size-3.5"
                />
              ) : (
                <User size={14} />
              )}
              <span>{post.author?.name ?? "—"}</span>
            </div>

            <Button asChild variant="ghost" size="sm" className="group/btn">
              <Link href={`/${post.slug}`}>
                Ler mais
                <ArrowRight
                  size={16}
                  className="ml-1 group-hover/btn:translate-x-1 transition-transform"
                />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
