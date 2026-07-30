import { Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

import Logo from "./logo";

const serviceLinks = [
  { label: "Laudos", href: "https://www.certifica.eng.br/servicos" },
  { label: "Consultoria", href: "https://www.certifica.eng.br/servicos" },
  {
    label: "Projetos Arquitetônicos",
    href: "https://www.certifica.eng.br/servicos",
  },
  {
    label: "Regularização de Imóveis",
    href: "https://www.certifica.eng.br/servicos",
  },
];

const companyLinks = [
  { label: "Sobre nós", href: "https://www.certifica.eng.br/#sobre" },
  { label: "Serviços", href: "https://www.certifica.eng.br/servicos" },
  { label: "Contato", href: "https://www.certifica.eng.br/#contact" },
  { label: "Blog", href: "/" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/certificaeng",
    icon: Facebook,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/certifica.eng/",
    icon: Instagram,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/certifica.eng/",
    icon: Linkedin,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#dfe2d9] bg-[#f7f7f2] px-5 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-b border-[#dfe2d9] pb-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo logoWidth="sm" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#62655f]">
              Informação técnica para cuidar do seu imóvel com clareza,
              segurança e responsabilidade.
            </p>
          </div>

          <FooterColumn title="Serviços" links={serviceLinks} />
          <FooterColumn title="Empresa" links={companyLinks} />

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-primary">
              Acompanhe
            </h3>
            <div className="flex gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid size-11 place-items-center rounded-full border border-[#cfd4ca] text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
                >
                  <Icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-7 text-sm text-[#70736d] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Certifica. Todos os direitos reservados.</p>
          <p>CNPJ: 60.567.670/0001-16</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-primary">
        {title}
      </h3>
      <ul className="space-y-3 text-sm text-[#62655f]">
        {links.map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              className="transition-colors hover:text-secondary"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
