import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { QuoteDialog } from "@/components/quote/QuoteDialog";
import { siteConfig } from "@/config/siteConfig";

const manrope = localFont({
  src: "../../node_modules/@fontsource-variable/manrope/files/manrope-latin-ext-wght-normal.woff2",
  variable: "--font-body",
  display: "swap",
});

const cormorant = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: siteConfig.title,
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    locale: "ro_RO",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f3ea",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={`${manrope.variable} ${cormorant.variable}`} data-scroll-behavior="smooth">
      <body>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <CookieConsent />
        <QuoteDialog />
      </body>
    </html>
  );
}
