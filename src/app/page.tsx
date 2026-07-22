import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { CapabilityRail } from "@/components/sections/CapabilityRail";
import { CollectionTabs } from "@/components/sections/CollectionTabs";
import { FinalCta } from "@/components/sections/FinalCta";
import { HeroSection } from "@/components/sections/HeroSection";
import { PersonalizerTeaser } from "@/components/sections/PersonalizerTeaser";
import { ProcessSection } from "@/components/sections/ProcessSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CapabilityRail />
      <ProcessSection />
      <PersonalizerTeaser />
      <CollectionTabs />
      <BenefitsSection />
      <FinalCta />
    </>
  );
}
