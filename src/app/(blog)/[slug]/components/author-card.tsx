import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface AuthorCardProps {
  author: {
    name: string;
    username: string;
    bio: string;
    hasAvatar: boolean;
  };
}

const AuthorCard = ({ author }: AuthorCardProps) => {
  const initials = author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <Card className="border-border bg-green-950/10">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4 ">
          <Avatar className="w-16 h-16 overflow-hidden">
            <AvatarImage
              src={
                author.hasAvatar ? `/api/users/avatar/${author.username}` : ""
              }
              alt={`@${author.username}`}
              className="w-full h-full object-center"
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center">
            <p className="font-medium text-foreground mb-2">{author.name}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {author.bio}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthorCard;
