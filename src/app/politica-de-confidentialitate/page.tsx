import { LegalPage } from "@/components/layout/LegalPage";
import { legalPages } from "@/content/legalContent";

export const metadata = {
  title: "Politica de confidențialitate — Cartpaper",
};

export default function PrivacyPage() {
  return <LegalPage page={legalPages.privacy} />;
}
