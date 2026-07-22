import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { QuoteDialog } from "@/components/quote/QuoteDialog";
import { AdaptiveHeaderTheme } from "@/components/motion/AdaptiveHeaderTheme";
import { GrainOverlay } from "@/components/motion/GrainOverlay";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { PageTransition } from "@/components/motion/PageTransition";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { siteConfig } from "@/config/siteConfig";

const manrope = localFont({
  src: "../../node_modules/@fontsource-variable/manrope/files/manrope-latin-ext-wght-normal.woff2",
  variable: "--font-body",
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
    <html lang="ro" className={manrope.variable} data-scroll-behavior="smooth">
      <body>
        <MotionProvider>
          <SmoothScrollProvider>
            <AdaptiveHeaderTheme />
            <ScrollProgress />
            <GrainOverlay />
            <Header />
            <PageTransition>
              <main id="main-content">{children}</main>
            </PageTransition>
            <Footer />
            <CookieConsent />
            <QuoteDialog />
          </SmoothScrollProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
