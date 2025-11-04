import { api } from "./api-client"

export async function trackPostView(slug: string, fp?: string) {
  // não usa cache/tags; é side-effect puro
  await api
    .post(`blog/posts/${encodeURIComponent(slug)}/view`, {
      json: fp ? { fp } : {},
      // evita que Next tente cachear algo aqui
      next: { revalidate: 0 },
    })
    .catch(() => {
      // tracking é "best effort" — falha silenciosa
    })
}