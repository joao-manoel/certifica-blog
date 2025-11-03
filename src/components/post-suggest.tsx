import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

const suggestedPosts = [
  {
    id: 1,
    title: "Eficiência Energética em Edifícios Comerciais",
    date: "28 de out. de 2025",
    readTime: "3 min",
    category: "Eficiência",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop",
  },
  {
    id: 2,
    title: "Certificações Ambientais: LEED e AQUA",
    date: "15 de out. de 2025",
    readTime: "5 min",
    category: "Certificações",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    title: "Materiais Sustentáveis na Construção Civil",
    date: "02 de out. de 2025",
    readTime: "4 min",
    category: "Materiais",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=250&fit=crop",
  },
  {
    id: 4,
    title: "Energia Solar em Projetos Residenciais",
    date: "20 de set. de 2025",
    readTime: "6 min",
    category: "Energia",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=250&fit=crop",
  },
];

export const SuggestedPosts = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground mb-4">
        Posts Sugeridos
      </h3>
      {suggestedPosts.map((post) => (
        <Card
          key={post.id}
          className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group glass-strong "
        >
          <div className="relative h-32 overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
          <div className="p-4">
            <span className="text-xs text-accent font-semibold">
              {post.category}
            </span>
            <h4 className="font-semibold text-sm mt-1 mb-2 text-foreground line-clamp-2 group-hover:text-accent transition-colors">
              {post.title}
            </h4>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}

      <button className="w-full cursor-pointer py-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors flex items-center justify-center gap-2 group">
        Ver todos os posts
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
