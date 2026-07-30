import { api } from "./api-client";

export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export async function listPublicCategories() {
  return api
    .get("blog/public/categories", {
      next: { tags: ["post-categories"] },
    })
    .json<PublicCategory[]>();
}
