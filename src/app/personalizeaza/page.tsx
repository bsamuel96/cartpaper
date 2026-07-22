import { PersonalizerLoader } from "@/components/personalizer/PersonalizerLoader";

export const metadata = {
  title: "Personalizează o pungă — Cartpaper",
  description: "Încarcă logo-ul, elimină fundalul și vezi simularea pe patru tipuri de pungă.",
};

export default function PersonalizeazaPage() {
  return <PersonalizerLoader />;
}
