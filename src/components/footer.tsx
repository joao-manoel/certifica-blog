import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="glass-strong border-t border-border/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-white border-2 flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  <img
                    src="images/certifica-icon-verde.png"
                    className="h-5 w-5"
                  />
                </span>
              </div>
              <span className="text-xl font-bold text-foreground">
                Certifica
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A confiança que seu imóvel precisa e a expertise que você merece!
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Serviços</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Laudos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Consultoria
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Projetos Arquitetônicos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Regularização de Imóveis
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Equipe
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Carreiras
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">
              Redes Sociais
            </h3>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/certificaeng"
                target="_blank"
                className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-primary/10 transition-colors"
              >
                <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
              <a
                href="https://www.instagram.com/certifica.eng/"
                target="_blank"
                className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-primary/10 transition-colors"
              >
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
              <a
                href="https://www.linkedin.com/company/certifica.eng/"
                target="_blank"
                className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-primary/10 transition-colors"
              >
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
              <a
                href="https://www.twitter.com/certifica.eng/"
                target="_blank"
                className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-primary/10 transition-colors"
              >
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Certifica. Todos os direitos reservados.</p>
          <p>CNPJ: 60.567.670/0001-16</p>
        </div>
      </div>
    </footer>
  )
}
