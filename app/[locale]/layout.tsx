import type { Metadata } from "next";
import Script from "next/script";
import { Geist, IBM_Plex_Mono, JetBrains_Mono, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { ThemeProvider } from "@/components/theme-provider";
import { NavProgress } from "@/components/nav-progress";
import { ScrollTop } from "@/components/scroll-top";
import { RippleCanvas } from "@/components/ripple-canvas";
import { MagneticCursor } from "@/components/magnetic-cursor";
import { MagneticEffect } from "@/components/magnetic-effect";
import "../globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });
const workshopDisplay = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-workshop-display" });
const workshopMono = IBM_Plex_Mono({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-workshop-mono" });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isId = locale === "id";
  const title = isId ? "Bima Aryadinata — Pengembang Full-Stack & Builder" : "Bima Aryadinata — Full-Stack Developer & Builder";
  const description = isId ? "Portofolio Bima Aryadinata, pengembang full-stack yang membangun sistem enterprise, produk AI, dan alat digital yang berguna." : "Portfolio of Bima Aryadinata, a full-stack developer building useful enterprise systems, AI products, and digital tools.";
  const url = `https://portfolio-bima-eosin.vercel.app/${locale}`;
  return {
    title,
    description,
  keywords: [
    "Bima Aryadinata",
    "Full-Stack Developer",
    "AI Developer",
    "NLP",
    "IndoBERT",
    "React",
    "NestJS",
    "Jakarta",
    "PT ASABRI",
    "portfolio",
  ],
  authors: [{ name: "Bima Aryadinata" }],
  metadataBase: new URL("https://portfolio-bima-eosin.vercel.app"),
  openGraph: {
    type: "website",
    title,
    description,
    url,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bima Aryadinata — Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
  },
    alternates: { canonical: url, languages: { en: "https://portfolio-bima-eosin.vercel.app/en", id: "https://portfolio-bima-eosin.vercel.app/id" } },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var saved = localStorage.getItem('pf-theme');
                if (saved === 'dark' || saved === 'light') {
                  document.documentElement.setAttribute('data-theme', saved);
                } else {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${spaceGrotesk.variable} ${geist.variable} ${jetbrainsMono.variable} ${workshopDisplay.variable} ${workshopMono.variable}`}>
        <Script
          id="json-ld-person"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Bima Aryadinata",
              url: "https://portfolio-bima-eosin.vercel.app/",
              jobTitle: "Full-Stack Developer & IT Communicator",
              alumniOf: {
                "@type": "EducationalOrganization",
                name: "Universitas Sriwijaya",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Jakarta",
                addressCountry: "ID",
              },
              sameAs: [
                "https://linkedin.com/in/bima-aryadinata",
                "https://github.com/ExRen",
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <NavProgress />
            <RippleCanvas />
            <MagneticCursor />
            <MagneticEffect />
            {children}
            <ScrollTop />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
