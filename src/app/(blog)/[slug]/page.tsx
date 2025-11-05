import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import Image from "next/image";
import { getPost } from "@/http/get-post";
import { PostClient } from "./post-client";

export const revalidate = 0;

type Params = { slug: string };

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug).catch(() => null);
  if (!post) return { title: "Post não encontrado" };

  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.certifica.eng.br";
  const metadataBase = new URL(base);

  const title = post.title;
  const description =
    post.excerpt ?? "Artigo publicado no blog Certifica Engenharia.";
  const path = `/${slug}`;
  const canonicalUrl = new URL(path, metadataBase).toString();

  const coverAbs = post.coverUrl
    ? post.coverUrl.startsWith("http")
      ? post.coverUrl
      : new URL(post.coverUrl, metadataBase).toString()
    : undefined;

  const fallbackOg = new URL(
    "/images/placeholder.jpg",
    metadataBase
  ).toString();
  const ogImage = coverAbs ?? fallbackOg;

  return {
    metadataBase,
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalUrl,
      siteName: "Certifica Engenharia",
      locale: "pt_BR",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

function isSocialBot(ua: string) {
  return /facebookexternalhit|WhatsApp|twitterbot|linkedinbot|Slackbot|TelegramBot|Discordbot/i.test(
    ua
  );
}

export default async function PostPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const post = await getPost(slug).catch(() => null);
  if (!post) notFound();

  const ua = (await headers()).get("user-agent") || "";
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.certifica.eng.br";
  const canonicalUrl = `${baseUrl}/${slug}`;

  if (isSocialBot(ua)) {
    return (
      <article>
        <h1>{post.title}</h1>
        <p>
          {post.excerpt ?? "Artigo publicado no blog Certifica Engenharia."}
        </p>
        {post.coverUrl ? (
          <Image
            src={post.coverUrl}
            alt={post.title}
            width={1200}
            height={630}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        ) : null}
      </article>
    );
  }

  return <PostClient post={post} canonicalUrl={canonicalUrl} />;
}
