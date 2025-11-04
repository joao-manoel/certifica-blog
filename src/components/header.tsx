"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";
import Logo from "./logo";

type NavLink = { label: string; href: string };

const NAV_LINKS: NavLink[] = [
  { label: "Início", href: `/` },
  { label: "Site Completo", href: `https://certifica.eng.br` },
];

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
        className
      )}
      aria-label="Navegação principal"
    >
      {links.map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          className="text-sm font-medium text-foreground hover:text-primary transition-colors"
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-24 h-16 md:h-20">
          {/* Logo */}
          <Link href="/#home" className="flex items-center gap-2">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavItems />
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-foreground p-2"
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
            className="md:hidden py-4 border-t border-border"
          >
            <NavItems direction="col" gap="gap-4" onItemClick={closeMenu} />
          </div>
        )}
      </div>
    </header>
  );
}
