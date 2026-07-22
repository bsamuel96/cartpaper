import { LegalPage } from "@/components/layout/LegalPage";
import { legalPages } from "@/content/legalContent";

export const metadata = {
  title: "Termeni și condiții — Cartpaper",
};

export default function TermsPage() {
  return <LegalPage page={legalPages.terms} />;
}
