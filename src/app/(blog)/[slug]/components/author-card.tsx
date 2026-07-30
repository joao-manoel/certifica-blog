import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { AuthorSummary } from "@/@types/types-posts";

interface AuthorCardProps {
  author: AuthorSummary;
}

const AuthorCard = ({ author }: AuthorCardProps) => {
  const initials = author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <Card className="border-[#d8ddd3] bg-white shadow-none">
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          <Avatar className="size-20 shrink-0 overflow-hidden border-2 border-white shadow-md ring-1 ring-[#d8ddd3]">
            <AvatarImage
              src={
                author.hasAvatar ? `/api/users/avatar/${author.username}` : ""
              }
              alt={`@${author.username}`}
              className="size-full object-cover object-center"
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--article-support)]">
              Sobre o autor
            </p>
            <p className="mt-2 font-oswald text-2xl font-bold uppercase text-[var(--article-heading)]">
              {author.name}
            </p>
            {author.bio ? (
              <p className="mt-2 text-sm leading-relaxed text-[#626a62]">
                {author.bio}
              </p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthorCard;
