"use client";

import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Search, ArrowRight, User } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useState } from "react";

const blogPosts = [
  {
    id: 1,
    title: "Regularização de Imóveis: Guia Completo 2024",
    excerpt:
      "Entenda todos os passos necessários para regularizar seu imóvel e evitar problemas futuros com a documentação.",
    category: "Regularização",
    date: "15 Mar 2024",
    readTime: "8 min",
    author: "Eng. Carlos Silva",
    image: "/images/placeholder.jpg",
  },
  {
    id: 2,
    title: "Importância do Laudo Técnico na Compra de Imóveis",
    excerpt:
      "Descubra por que um laudo técnico é essencial antes de adquirir um imóvel e quais problemas ele pode identificar.",
    category: "Laudos",
    date: "10 Mar 2024",
    readTime: "6 min",
    author: "Eng. Maria Santos",
    image: "/images/placeholder.jpg",
  },
  {
    id: 3,
    title: "Projeto Arquitetônico: Do Conceito à Execução",
    excerpt:
      "Conheça todas as etapas de um projeto arquitetônico e como garantir que sua obra seja executada com perfeição.",
    category: "Projetos",
    date: "5 Mar 2024",
    readTime: "10 min",
    author: "Arq. João Oliveira",
    image: "/images/placeholder.jpg",
  },
  {
    id: 4,
    title: "Consultoria em Engenharia: Quando Contratar?",
    excerpt:
      "Saiba em quais situações a consultoria especializada pode economizar tempo e dinheiro em seus projetos.",
    category: "Consultoria",
    date: "1 Mar 2024",
    readTime: "7 min",
    author: "Eng. Ana Costa",
    image: "/images/placeholder.jpg",
  },
  {
    id: 5,
    title: "Normas Técnicas Atualizadas para Construção Civil",
    excerpt:
      "Fique por dentro das principais atualizações nas normas técnicas da ABNT para construção civil em 2024.",
    category: "Normas",
    date: "25 Fev 2024",
    readTime: "9 min",
    author: "Eng. Pedro Almeida",
    image: "/images/placeholder.jpg",
  },
  {
    id: 6,
    title: "Sustentabilidade em Projetos de Engenharia",
    excerpt:
      "Como implementar práticas sustentáveis em projetos de engenharia e obter certificações ambientais.",
    category: "Sustentabilidade",
    date: "20 Fev 2024",
    readTime: "8 min",
    author: "Eng. Lucia Ferreira",
    image: "/images/placeholder.jpg",
  },
];

const categories = [
  "Todos",
  "Regularização",
  "Laudos",
  "Projetos",
  "Consultoria",
  "Normas",
  "Sustentabilidade",
];

export default function HomePage() {
  const heroAnimation = useScrollAnimation();
  const searchAnimation = useScrollAnimation();
  const card0Animation = useScrollAnimation();
  const card1Animation = useScrollAnimation();
  const card2Animation = useScrollAnimation();
  const card3Animation = useScrollAnimation();
  const card4Animation = useScrollAnimation();
  const card5Animation = useScrollAnimation();
  const cardAnimations = [
    card0Animation,
    card1Animation,
    card2Animation,
    card3Animation,
    card4Animation,
    card5Animation,
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todos" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div
            ref={heroAnimation.ref}
            className={`text-center animate-on-scroll animate-fade-up ${
              heroAnimation.isVisible ? "animated" : ""
            }`}
          >
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

          {/* Search and Filter */}
          <div
            ref={searchAnimation.ref}
            className={`mt-12 animate-on-scroll animate-fade-up ${
              searchAnimation.isVisible ? "animated" : ""
            }`}
          >
            <div className="glass-strong rounded-2xl p-6 max-w-3xl mx-auto">
              <div className="relative mb-6">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <Input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category ? "" : "bg-background/50"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Nenhum artigo encontrado
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => {
                const cardAnimation = cardAnimations[post.id - 1];
                return (
                  <div
                    key={post.id}
                    ref={cardAnimation.ref}
                    className={`animate-on-scroll animate-scale ${
                      cardAnimation.isVisible ? "animated" : ""
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Card className="glass h-full hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-primary text-primary-foreground">
                            {post.category}
                          </Badge>
                        </div>
                      </div>

                      <CardHeader>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{post.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{post.readTime}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User size={14} />
                            <span>{post.author}</span>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="group/btn"
                          >
                            Ler mais
                            <ArrowRight
                              size={16}
                              className="ml-1 group-hover/btn:translate-x-1 transition-transform"
                            />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
