import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import PostsGrid from "./post-grid";

const categories = [
  "Todos",
  "Regularização",
  "Laudos",
  "Projetos",
  "Consultoria",
  "Normas",
  "Sustentabilidade",
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Blog Certifica
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Conhecimento em Engenharia
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Artigos, guias e insights sobre engenharia, arquitetura e
            regularização de imóveis
          </p>
        </div>
      </section>

      {/* Barra de busca + filtros ficam dentro do componente cliente para controlar estado */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <PostsGrid categories={categories} />
        </div>
      </section>
    </div>
  );
}
