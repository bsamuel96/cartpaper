import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/source-serif-4";
import "@/app/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { QuoteDialog } from "@/components/quote/QuoteDialog";
import { siteConfig } from "@/config/siteConfig";

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
    images: [{ url: "/brand/og-mark-light.png", width: 512, height: 512, alt: "Cartpaper" }],
  },
  icons: {
    icon: [
      { url: "/brand/favicon-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/brand/favicon-dark.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: siteConfig.brandLime,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro">
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
