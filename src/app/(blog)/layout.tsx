import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Certifica Engenharia | Blog",
    template: "%s | Certifica Engenharia",
  },
  description:
    "Artigos e publicações sobre engenharia e arquitetura sustentável.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Certifica Engenharia",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@certifica",
  },
};

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
