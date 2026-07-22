import { LegalPage } from "@/components/layout/LegalPage";
import { legalPages } from "@/content/legalContent";

export const metadata = {
  title: "Politica de cookies — Cartpaper",
};

export default function CookiesPage() {
  return <LegalPage page={legalPages.cookies} />;
}
