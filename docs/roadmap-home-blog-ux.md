# Roadmap de UX — Home do Blog Certifica

## Objetivo

Transformar a home do blog em uma experiência editorial clara, elegante e coerente com a landing page da Certifica, facilitando três tarefas principais:

1. descobrir conteúdos relevantes;
2. buscar e filtrar artigos com pouco esforço;
3. entender rapidamente tema, valor e tempo de leitura de cada publicação.

## Diagnóstico

### Padrões fortes da landing page

- Fundo marfim claro, verde profundo como cor institucional e laranja reservado para ações.
- Títulos em Oswald, grandes, condensados e frequentemente em caixa alta.
- Source Sans para textos, controles e informações auxiliares.
- Composição assimétrica, bastante espaço em branco e linhas divisórias discretas.
- Imagens arquitetônicas grandes, com recortes limpos e cantos moderadamente arredondados.
- Hierarquia editorial por meio de eyebrow labels com tracking amplo, números e títulos fortes.
- Interações contidas: a interface transmite precisão técnica, sem excesso de efeitos.

### Problemas da home atual

- O hero é genérico e centralizado; não cria a mesma presença editorial da landing.
- Busca e categorias ficam dentro de um bloco `glass` com aparência de dashboard.
- Todos os posts têm o mesmo peso visual; não existe artigo em destaque nem caminho de descoberta.
- Categorias são fixas no frontend e podem divergir das categorias realmente publicadas.
- A busca só passa a valer a partir de dois caracteres, mas não comunica esse comportamento.
- Falta resultado contextual: quantidade encontrada, termo ativo e filtros aplicados.
- O estado vazio não orienta o usuário a limpar filtros ou explorar outra categoria.
- A paginação é funcional, porém pouco informativa e mantém controles mesmo quando há uma única página.
- O card possui múltiplos alvos concorrentes e uma hierarquia pouco editorial.
- As animações em todos os cards podem atrasar a leitura e não respeitam explicitamente `prefers-reduced-motion`.
- A página adiciona `Header` apesar de o layout raiz já renderizá-lo, causando duplicação semântica.
- Busca e filtros vivem apenas no estado do componente; a URL não pode ser compartilhada nem restaurada.

## Direção proposta

### Arquitetura da página

1. Header institucional existente.
2. Hero editorial assimétrico.
3. Artigo em destaque.
4. Barra de descoberta com busca, categorias e ordenação.
5. Cabeçalho de resultados com total e filtros ativos.
6. Grid de artigos.
7. Paginação.
8. Bloco final de conversão para serviços ou orçamento.

### Hero

- Eyebrow: `CONTEÚDO TÉCNICO · CERTIFICA`.
- Título curto e forte em Oswald: `ENGENHARIA PARA DECIDIR COM SEGURANÇA`.
- Texto de apoio limitado a aproximadamente 60 caracteres por linha.
- Campo de busca principal integrado ao hero em desktop.
- Fundo marfim e detalhe gráfico técnico sutil, sem glassmorphism.

### Artigo em destaque

- Primeiro artigo em layout 7/5: imagem ampla de um lado e conteúdo do outro.
- Exibir categoria, título, resumo, autor, data e tempo de leitura.
- Um CTA claro: `Ler artigo`.
- Usar destaque editorial apenas quando não houver busca ou categoria ativa.

### Busca e filtros

- Campo com label acessível e placeholder mais orientativo: `Busque por tema, norma ou serviço`.
- Botão para limpar a busca quando houver texto.
- Categorias em uma faixa horizontal rolável no mobile.
- Categorias obtidas da API; evitar lista fixa.
- Seleção visível por fundo verde, contraste suficiente e `aria-pressed`.
- Adicionar ordenação: `Mais recentes` e `Mais relevantes` durante buscas.
- Sincronizar `q`, `categoria`, `ordem` e `pagina` com query parameters.
- Manter debounce, mas comunicar o carregamento sem substituir toda a grade.

### Resultados

- Mostrar `24 artigos` ou `6 resultados para “regularização”`.
- Exibir filtros ativos como chips removíveis e ação `Limpar filtros`.
- Preservar os cards existentes enquanto uma nova consulta carrega, reduzindo saltos de layout.
- Rolar/focar o título dos resultados ao mudar de página.

### Cards

- Imagem 16:10 com `object-cover` e zoom de hover mais discreto.
- Categoria como eyebrow textual; evitar badge flutuante sobre toda imagem.
- Título como principal alvo clicável e card inteiro com affordance consistente.
- Resumo limitado a duas ou três linhas.
- Metadados reduzidos a data e tempo de leitura.
- Autor com avatar de 28–32 px, usando o mesmo tratamento corrigido no card de autor.
- Alturas consistentes no grid sem esconder informação essencial.
- Laranja apenas no indicador de ação/hover, preservando o verde como base.

### Estados da interface

- Skeletons com a mesma geometria do destaque e dos cards finais.
- Estado vazio com mensagem contextual, botão `Limpar filtros` e categorias sugeridas.
- Estado de erro com texto humano, tentativa novamente e preservação dos filtros.
- Ocultar a paginação quando `totalPages <= 1`.
- Em mobile, usar botões de paginação largos e área de toque mínima de 44 px.

## Roadmap de implementação

### Fase 0 — Correções estruturais

- Remover o `Header` duplicado da página.
- Centralizar categorias e parâmetros de consulta em uma única fonte.
- Definir os contratos para destaque, categorias e ordenação.
- Revisar contraste, landmarks e hierarquia de headings.

**Critério de aceite:** apenas um header e um `h1`; sem regressões na listagem atual.

### Fase 1 — Fundação visual

- Ajustar os tokens para o marfim, verde e laranja da landing.
- Reduzir o uso de `glass` na home e criar superfícies editoriais opacas.
- Criar primitives reutilizáveis de eyebrow, divisória, container e título de seção.
- Padronizar espaçamento e raios.

**Critério de aceite:** a página é reconhecível como parte da mesma marca mesmo sem o logotipo.

### Fase 2 — Hero e destaque editorial

- Implementar o hero assimétrico.
- Criar `FeaturedPost`.
- Definir fallback quando não houver post elegível.
- Otimizar a imagem do destaque para LCP.

**Critério de aceite:** o conteúdo prioritário e a ação principal são entendidos em até cinco segundos.

### Fase 3 — Descoberta, busca e filtros

- Refatorar a barra de busca e as categorias.
- Buscar categorias dinamicamente.
- Adicionar limpar busca, filtros ativos e total de resultados.
- Sincronizar o estado com a URL.
- Adicionar ordenação contextual.

**Critério de aceite:** voltar/avançar do navegador restaura filtros; uma URL copiada reproduz a mesma busca.

### Fase 4 — Grid, cards e paginação

- Redesenhar `PostCard` com hierarquia editorial.
- Criar grid responsivo de 1/2/3 colunas.
- Melhorar a paginação e ocultá-la quando desnecessária.
- Preservar resultados durante refetch.

**Critério de aceite:** cards mantêm alinhamento, leitura e alvos de toque adequados em 360, 768 e 1280 px.

### Fase 5 — Estados, acessibilidade e movimento

- Refinar skeleton, vazio e erro.
- Garantir navegação completa por teclado.
- Incluir `aria-live` para contagem de resultados.
- Respeitar `prefers-reduced-motion`.
- Validar contraste WCAG AA e foco visível.

**Critério de aceite:** fluxo de buscar, filtrar, abrir artigo e paginar funciona apenas com teclado e leitor de tela.

### Fase 6 — Performance e validação

- Auditar LCP, CLS e INP.
- Revisar `sizes`, prioridade e qualidade das imagens.
- Testar busca lenta, API vazia e falha de rede.
- Validar mobile real e principais navegadores.
- Instrumentar eventos de busca, filtro, abertura de artigo e paginação.

**Critério de aceite:** sem layout shift perceptível; LCP alvo menor que 2,5 s e INP menor que 200 ms no percentil 75.

## Ordem recomendada

Executar as fases 0–3 como primeiro incremento publicável. Elas produzem o maior ganho de percepção de marca e descoberta. As fases 4–6 consolidam consistência, acessibilidade e desempenho.

## Métricas de sucesso

- taxa de abertura de artigos a partir da home;
- uso e taxa de sucesso da busca;
- uso de categorias e remoção de filtros;
- buscas sem resultado;
- profundidade de navegação e artigos por sessão;
- conversões para serviços/orçamento vindas do blog;
- Core Web Vitals da home.

