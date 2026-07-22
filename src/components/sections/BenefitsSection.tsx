import { CheckCircle2 } from "lucide-react";
import { homeContent } from "@/content/siteContent";
import { PointerSpotlight } from "@/components/motion/PointerSpotlight";

export function BenefitsSection() {
  return (
    <section className="pageBand darkBand" id="de-ce-cartpaper" data-header-theme="dark" aria-labelledby="benefits-title">
      <p className="overline">{homeContent.benefits.overline}</p>
      <h2 id="benefits-title">{homeContent.benefits.title}</h2>
      <div className="benefitGrid">
        {homeContent.benefits.cards.map((card) => (
          <PointerSpotlight className="benefitCard spotlightCard" key={card.title}>
            <CheckCircle2 aria-hidden="true" size={24} />
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </PointerSpotlight>
        ))}
      </div>
    </section>
  );
}
