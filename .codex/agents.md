# Certifica Blog — orientações para agentes

## Visão do projeto

Frontend público do blog Certifica, construído com Next.js 16 (App Router),
React 19 e TypeScript estrito. Consome a API do `certifica-backend`, renderiza
posts, pesquisa e relacionados, registra visualizações/UTM e prioriza SEO,
legibilidade e desempenho.

## Mapa do código

- `src/app/(blog)`: listagem pública e página de post por slug.
- `src/app/layout.tsx`, `sitemap.ts` e metadados das páginas: SEO global.
- `src/http`: único lugar para chamadas à API via `ky`.
- `src/hooks`: queries e comportamento interativo do cliente.
- `src/components`: composição visual; `src/components/ui` contém primitivas.
- `src/utils`: sanitização, normalização e conversão de conteúdo do editor.
- `src/@types/types-posts.ts`: contratos de post compartilhados dentro do app.

## Convenções de implementação

- Prefira Server Components; adicione `"use client"` apenas quando hooks, estado,
  browser APIs ou eventos exigirem.
- Faça acesso HTTP pelas funções de `src/http`; não espalhe `fetch` ou URLs da API
  pelos componentes.
- Use o alias `@/*` para `src`.
- Preserve o padrão visual existente e reutilize primitivas de
  `src/components/ui` antes de criar variantes.
- Trate estados de loading, vazio e erro nas listagens e mantenha layouts
  responsivos.
- Conteúdo de post vindo da API é não confiável: mantenha a sanitização antes de
  usar HTML e não introduza `dangerouslySetInnerHTML` sem essa barreira.
- Preserve acessibilidade semântica, navegação por teclado e texto alternativo.
- Ao alterar post, autor ou URL, revise metadata, canonical, sitemap, dados
  estruturados e compartilhamento social.
- Tracking de visualização e UTM não deve bloquear renderização nem registrar o
  mesmo evento inadvertidamente.

## API e ambiente

- `src/http/api-client.ts` injeta o token quando disponível e a API key.
- Variáveis esperadas: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_API_KEY`,
  `NEXT_PUBLIC_WEBSITE_URL` e `NEXT_PUBLIC_BASE_URL`.
- Nunca versione valores de `.env`. Variáveis `NEXT_PUBLIC_*` ficam expostas ao
  navegador; não coloque segredos novos nelas.
- Mudanças nos tipos ou chamadas devem permanecer compatíveis com os contratos do
  backend.

## Estilo e validação

- Siga a formatação do arquivo tocado; o projeto ainda contém estilos históricos
  com aspas e ponto e vírgula diferentes.
- Não faça reformatação ampla como efeito colateral.
- Desenvolvimento: `npm run dev`
- Lint: `npm run lint`
- Build e typecheck do Next: `npm run build`
- Produção local após build: `npm run start`

Não há suíte de testes configurada. Antes de concluir, rode lint e build. Para
mudanças visuais, confira desktop e mobile; para posts, confira uma listagem, uma
página por slug, links e conteúdo sanitizado.
