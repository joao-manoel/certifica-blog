import type React from "react";
import type { Metadata } from "next";
import { Oswald, Source_Sans_3 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Providers from "./provider";
import "./globals.css";

const _oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-oswald-var",
});
const _sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-source-sans-var",
});

export const metadata: Metadata = {
  title: "Certifica - Blog",
  description:
    "A confiança que seu imóvel precisa, e a expertise que você merece!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta
          name="facebook-domain-verification"
          content="r2oozs5ldn277cmz5xc9osbqlbgw4d"
        />
      </head>
      <body
        className={`${_sourceSans.variable} ${_oswald.variable} ${_sourceSans.className}
          antialiased`}
        cz-shortcut-listen="true"
      >
        <Providers>
          <Header />
          <div className="min-h-screen bg-background">
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

            {children}
          </div>
          <Footer />
          <Analytics />
        </Providers>
        <script src="https://www.instagram.com/embed.js" />
      </body>
    </html>
  );
}
