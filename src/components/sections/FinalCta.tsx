import { Phone, Send } from "lucide-react";
import { homeContent } from "@/content/siteContent";
import { QuoteButton } from "@/components/quote/QuoteButton";

export function FinalCta() {
  return (
    <section className="finalCta" data-header-theme="lime" aria-labelledby="final-cta-title">
      <span className="finalCtaHandle" aria-hidden="true" />
      <p className="overline">{homeContent.finalCta.overline}</p>
      <h2 id="final-cta-title">{homeContent.finalCta.title}</h2>
      <p>{homeContent.finalCta.body}</p>
      <div className="heroActions">
        <QuoteButton className="button buttonPrimary">
          <Send aria-hidden="true" size={18} />
          {homeContent.finalCta.primary}
        </QuoteButton>
        <QuoteButton className="button buttonSecondary">
          <Phone aria-hidden="true" size={18} />
          {homeContent.finalCta.secondary}
        </QuoteButton>
      </div>
    </section>
  );
}
