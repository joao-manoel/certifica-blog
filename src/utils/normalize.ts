// utils/normalize.ts
import type { AuthorSummary } from "@/@types/types-posts";

type AnyAuthor = { id: string; name: string; username: string; bio?: string | null; hasAvatar?: boolean };

export function normalizeAuthor(a: AnyAuthor): AuthorSummary {
  return {
    id: a.id,
    name: a.name,
    username: a.username,
    bio: a.bio ?? null,
    hasAvatar: a.hasAvatar ?? false,
  };
}
