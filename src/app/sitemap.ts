import type { MetadataRoute } from "next";

// Simulação; troque por sua busca real (ex.: GET /blog/posts?status=PUBLISHED)
async function getPublishedPosts(): Promise<
  Array<{
    slug: string;
    updatedAt?: string | Date;
    publishedAt?: string | Date;
  }>
> {
  return [];
}

const toDate = (d?: string | Date) => (d ? new Date(d) : undefined);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.certifica.eng.br";
  const posts = await getPublishedPosts();

  const urls = [
    {
      url: `${base}/`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    ...posts.map((p) => ({
      url: `${base}/${p.slug}`,
      lastModified: toDate(p.updatedAt ?? p.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ] satisfies MetadataRoute.Sitemap;

  return urls;
}
