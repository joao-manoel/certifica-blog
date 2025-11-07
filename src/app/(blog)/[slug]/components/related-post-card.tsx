// components/related-post-card.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import Link from "next/link";
import type { AuthorSummary, PostListItem } from "@/@types/types-posts";

// O card só precisa desses campos
type RelatedPostSummary = Pick<
  PostListItem,
  "title" | "slug" | "coverUrl" | "publishedAt" | "author"
>;

function formatDate(dateISO: string | null) {
  if (!dateISO) return "";
  try {
    const d = new Date(dateISO);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return "";
  }
}

const RelatedPostCard = ({ post }: { post: RelatedPostSummary }) => {
  const { title, slug, coverUrl, publishedAt, author } = post;

  return (
    <Link href={`/${slug}`}>
      <Card className="overflow-hidden border-border hover:shadow-lg transition-shadow">
        <div className="aspect-4/3 overflow-hidden">
          <img
            src={coverUrl || "/default-cover.jpg"}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-2">
            {author?.name ?? "Autor desconhecido"}
          </p>
          <h3 className="font-semibold text-foreground leading-tight mb-3 line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(publishedAt)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RelatedPostCard;
