import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/personalizeaza",
    "/politica-de-confidentialitate",
    "/politica-de-cookies",
    "/termeni-si-conditii",
  ];

  return routes.map((route) => ({
    url: `${siteConfig.siteUrl}${route}`,
    lastModified: new Date("2026-07-22"),
  }));
}
