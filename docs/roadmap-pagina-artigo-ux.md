# Roadmap de UX — Página de artigo do Blog Certifica

## Objetivo

Melhorar a leitura, a hierarquia editorial e a conversão da página de artigo sem neutralizar as cores, os estilos e os componentes inseridos no corpo pelo TinyMCE.

Página analisada:

`https://blog.certifica.eng.br/quanto-custa-construir-casa-2026`

## Regra central: corpo editorial protegido

O corpo do artigo já possui uma identidade visual própria, gravada parcialmente como estilos inline:

| Papel | Cor observada |
| --- | --- |
| Texto principal | `#2B2E2C` |
| Títulos H2 | `#263B33` |
| Subtítulos H3 e palavras-chave | `#3E5C50` |
| Linhas, bordas e apoio | `#8FAF9F` |
| Valores e destaques | `#D97742` |
| Caixas editoriais | `#F4F2ED` |

Essas cores são coerentes com a marca e devem ser preservadas.

### Contrato de estilos

- A moldura da página pode reutilizar essa paleta, porém sem redefinir cores de descendentes do `.tinymce-content`.
- Não usar seletores globais como `.tinymce-content * { color: ... }`.
- Não usar `!important` para padronizar títulos, links, listas, caixas ou destaques.
- Estilos inline sanitizados continuam tendo prioridade.
- O fallback CSS só estiliza elementos que não receberam cor ou composição do editor.
- Dark mode não deve inverter automaticamente o conteúdo editorial salvo.
- Criar variáveis próprias do artigo para documentar a paleta:

```css
--article-ink: #2b2e2c;
--article-heading: #263b33;
--article-support: #3e5c50;
--article-line: #8faf9f;
--article-accent: #d97742;
--article-surface: #f4f2ed;
```

## Diagnóstico da página atual

### Pontos positivos

- Título e imagem de capa criam contexto imediato.
- A paleta do conteúdo é consistente e tecnicamente sóbria.
- H2 com linha verde facilita a varredura do artigo.
- Valores destacados em laranja funcionam bem.
- Caixas editoriais possuem contraste e hierarquia adequados.
- O player de áudio agrega acessibilidade e conveniência.
- Autor, data e tempo de leitura estão disponíveis no topo.

### Pontos a melhorar

#### Hero

- Ocupa aproximadamente 60% da altura da tela e atrasa o início da leitura.
- O glassmorphism compete com a linguagem editorial mais limpa adotada na home.
- No mobile, título, metadados e cinco ações sociais deixam o topo muito denso.
- A imagem fica muito desfocada pela sobreposição e perde valor visual.
- Os botões de compartilhamento possuem pesos visuais diferentes.

#### Corpo e legibilidade

- A coluna principal é larga para leitura contínua.
- Há muitos parágrafos justificados; no mobile surgem espaços irregulares entre palavras.
- Figuras com `float` e largura de `42%` comprimem o texto no mobile, formando colunas estreitas.
- A cor de fundo geral é próxima dos verdes do conteúdo e reduz a separação entre página e artigo.
- O player de áudio parece solto, sem relação visual clara com o início do texto.
- Não existe indicador de progresso de leitura.
- Não há sumário para um artigo longo com vários H2.

#### Sidebar

- A bio do autor e os posts sugeridos competem com a leitura em desktop.
- A sidebar é declarada como sticky, mas o comportamento e a altura não são tratados como uma unidade.
- Existem recomendações na sidebar e também no final, criando redundância.
- Os títulos sugeridos são truncados e oferecem pouco contexto.

#### Encerramento

- Tags, compartilhamento, recomendações e autor formam uma sequência longa e pouco hierarquizada.
- O CTA “Gostou deste conteúdo?” é genérico e não leva naturalmente a um serviço relacionado.
- Falta uma ponte entre a informação técnica e a ação comercial da Certifica.

#### Acessibilidade e código

- `PostMeta` recebe dados do avatar, mas não os utiliza.
- O ícone do WhatsApp usa `<img>` sem `alt`.
- `PostContent` chama hooks condicionalmente, contrariando as regras do React.
- O conteúdo só aparece após o mount, gerando atraso visual desnecessário.
- A página carrega duas experiências de posts relacionados.
- O script do Instagram é inserido tanto no layout quanto no componente.

## Arquitetura proposta

1. Breadcrumb discreto.
2. Cabeçalho editorial compacto.
3. Imagem de capa.
4. Barra de utilidades: autor, data, leitura, áudio e compartilhamento.
5. Layout de leitura com coluna principal limitada.
6. Sumário lateral sticky em desktop.
7. Corpo TinyMCE isolado.
8. Bloco de autor no encerramento.
9. CTA contextual para serviço.
10. Posts relacionados.

## Roadmap

### Fase 0 — Isolamento e segurança visual

- Criar o contrato de variáveis `--article-*`.
- Consolidar os estilos de `.tinymce-content`, hoje divididos entre arquivos diferentes.
- Garantir que inline styles do editor continuem prevalecendo.
- Remover qualquer influência automática do dark mode sobre conteúdo salvo.
- Criar uma página de fixtures com H2, H3, links, listas, blockquotes, tabelas, imagens e cores inline.

**Critério de aceite:** o artigo analisado mantém exatamente suas cores de títulos, destaques, linhas e caixas depois da refatoração.

### Fase 1 — Cabeçalho editorial

- Trocar o hero de 60vh por um cabeçalho mais compacto.
- Separar título e capa: título sobre fundo marfim; imagem abaixo em proporção editorial.
- Manter categoria como eyebrow.
- Organizar autor, data e tempo em uma única linha adaptável.
- Exibir uma ação principal de compartilhamento e mover redes específicas para um popover.
- No mobile, limitar o título e as utilidades à largura útil sem sobreposição.

**Critério de aceite:** o primeiro parágrafo aparece mais cedo e o topo não exige rolagem excessiva em 390 px de largura.

### Fase 2 — Coluna de leitura e tipografia

- Limitar o texto a aproximadamente `68–74ch`.
- Usar fundo externo `#F7F7F2` e superfície de leitura neutra, sem aplicar cor no conteúdo interno.
- Manter corpo em Source Sans e títulos editoriais em Oswald.
- Desativar `text-align: justify` abaixo de 768 px.
- Ajustar ritmo vertical de parágrafos, headings e figuras.
- Aplicar `scroll-margin-top` nos headings.

**Critério de aceite:** parágrafos permanecem confortáveis em desktop e não apresentam “rios” de espaço no mobile.

### Fase 3 — Responsividade do conteúdo TinyMCE

- Sobrescrever apenas propriedades de layout no mobile, sem alterar cores:
  - `figure { float: none !important; width: 100% !important; }`
  - margens laterais zeradas;
  - imagens fluidas;
  - tabelas dentro de wrapper com rolagem horizontal.
- Preservar `style.color`, `background`, `border-color` e destaques inline.
- Normalizar embeds, vídeos e legendas.
- Testar conteúdos antigos com alinhamento à esquerda e à direita.

**Critério de aceite:** nenhuma figura comprime o texto em 320–430 px e nenhuma tabela aumenta a largura da página.

### Fase 4 — Navegação durante a leitura

- Gerar sumário a partir dos H2/H3 sanitizados.
- Mostrar sumário sticky no desktop e `<details>` recolhível no mobile.
- Adicionar barra discreta de progresso de leitura.
- Incluir ação “Voltar ao topo”.
- Garantir IDs estáveis e links de seção compartilháveis.

**Critério de aceite:** o leitor consegue chegar a qualquer seção longa em uma interação.

### Fase 5 — Áudio e compartilhamento

- Integrar o player em uma barra de utilidades abaixo da capa.
- Dar ao player estados claros: reproduzir, pausar, progresso, duração e velocidade.
- Reduzir o topo para um botão “Compartilhar”; opções sociais ficam em popover.
- Manter “Copiar link” com feedback acessível via `aria-live`.
- Corrigir ícones, textos alternativos e áreas mínimas de toque.

**Critério de aceite:** áudio e compartilhamento ocupam menos espaço no mobile e funcionam integralmente via teclado.

### Fase 6 — Autor, CTA e relacionados

- Remover recomendações duplicadas da sidebar.
- Levar o autor para o encerramento do artigo, com avatar sem distorção, bio curta e credenciais.
- Criar CTA contextual com base na categoria do post:
  - Construção Civil → projeto/orçamento;
  - Regularização → diagnóstico do imóvel;
  - Laudos → falar com especialista.
- Exibir três relacionados em cards editoriais, depois do CTA.
- Manter tags como informação secundária, não como bloco principal.

**Critério de aceite:** o encerramento segue a ordem “confiança → próxima ação → continuar lendo”.

### Fase 7 — Acessibilidade, performance e qualidade

- Corrigir a ordem condicional de hooks em `PostContent`.
- Renderizar HTML sanitizado sem aguardar mount quando não houver dependência do navegador.
- Consolidar o carregamento do script do Instagram.
- Revisar `next/image`, `sizes`, prioridade da capa e CLS.
- Validar heading hierarchy, landmarks, foco e contraste WCAG AA.
- Respeitar `prefers-reduced-motion`.
- Medir LCP, CLS e INP no artigo real.

**Critério de aceite:** build e lint sem erros nos componentes alterados; navegação completa por teclado; LCP alvo abaixo de 2,5 s.

## Ordem recomendada

Primeiro incremento publicável:

1. Fase 0 — proteção das cores;
2. Fase 2 — coluna de leitura;
3. Fase 3 — correção mobile de imagens e tabelas;
4. Fase 1 — novo cabeçalho.

Esse conjunto resolve os maiores problemas de leitura sem colocar em risco o conteúdo existente. Depois entram navegação, áudio, conversão e recomendações.

## Matriz de não regressão visual

Antes de publicar, comparar:

- artigo com cores inline;
- artigo sem estilos inline;
- artigo com imagem flutuante à esquerda;
- artigo com imagem flutuante à direita;
- artigo com tabela larga;
- artigo com blockquote;
- artigo com embed;
- artigo com listas e valores em laranja;
- desktop em 1280 e 1440 px;
- mobile em 320, 390 e 430 px.

Em todos os casos, a moldura pode mudar, mas as cores autorais dentro de `.tinymce-content` devem permanecer intactas.
