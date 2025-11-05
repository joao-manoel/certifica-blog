import type React from "react";
import type { Metadata } from "next";
import { Anton, Roboto } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Providers from "./provider";
import "./globals.css";

const _anton = Anton({ subsets: ["latin"], weight: "400" });
const _roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "400", "800"],
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
        className={`${_roboto.className} ${_anton.className}
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
      </body>
    </html>
  );
}
