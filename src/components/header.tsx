"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";
import clsx from "clsx";
import Logo from "./logo";

type NavLink = { label: string; href: string };

const NAV_LINKS: NavLink[] = [
  { label: "Início", href: "https://certifica.eng.br/#home" },
  { label: "Sobre", href: "https://certifica.eng.br/#sobre" },
  { label: "Serviços", href: "https://certifica.eng.br/servicos" },
  { label: "Contato", href: "https://certifica.eng.br/#contact" },
  { label: "Blog", href: "/" },
];

function CtaButton({
  className,
  onClick,
  children = "Solicitar Orçamento",
}: {
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
}) {
  return (
    <Button
      variant="secondary"
      size="lg"
      asChild
      className={clsx(
        "h-12 rounded-lg px-6 text-base font-bold shadow-none hover:bg-secondary/90",
        className,
      )}
      onClick={onClick}
    >
      <Link href="https://www.certifica.eng.br/orcamento">{children}</Link>
    </Button>
  );
}

function NavItems({
  links = NAV_LINKS,
  direction = "row",
  gap = "gap-8",
  onItemClick,
  className,
}: {
  links?: NavLink[];
  direction?: "row" | "col";
  gap?: string;
  onItemClick?: () => void;
  className?: string;
}) {
  return (
    <nav
      className={clsx(
        "items-center",
        direction === "row" ? "flex" : "flex flex-col",
        gap,
        className,
      )}
      aria-label="Navegação principal"
    >
      {links.map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          className="text-base font-medium text-[#5f615d] transition-colors hover:text-primary"
          onClick={onItemClick}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#e4ded5] bg-[#fbfbf9]">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex h-20 items-center justify-between md:h-[100px]">
          <Link
            href="/#home"
            className="flex shrink-0 items-center gap-2"
            aria-label="Certifica - Página inicial"
          >
            <Logo />
          </Link>

          <div className="hidden items-center gap-9 md:flex lg:gap-12">
            <NavItems gap="gap-8 lg:gap-10" />
            <CtaButton className="min-w-[132px]">Orçamento</CtaButton>
          </div>

          <button
            className="rounded-md p-2 text-foreground transition-colors hover:bg-secondary/10 md:hidden"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="border-t border-[#e4ded5] py-5 md:hidden"
          >
            <NavItems direction="col" gap="gap-4" onItemClick={closeMenu} />
            <div className="pt-3">
              <CtaButton className="w-full" onClick={closeMenu} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
