import { Phone, Send } from "lucide-react";
import { companyConfig } from "@/config/companyConfig";
import { homeContent } from "@/content/siteContent";
import { QuoteButton } from "@/components/quote/QuoteButton";

export function FinalCta() {
  return (
    <section className="finalCta" aria-labelledby="final-cta-title">
      <span className="finalCtaHandle" aria-hidden="true">
        <span />
      </span>
      <p className="overline">{homeContent.finalCta.overline}</p>
      <h2 id="final-cta-title">{homeContent.finalCta.title}</h2>
      <p>{homeContent.finalCta.body}</p>
      <div className="heroActions">
        <QuoteButton className="button buttonPrimary" quoteDetail={{ requestType: "mostre" }}>
          <Send aria-hidden="true" size={18} />
          {homeContent.finalCta.primary}
        </QuoteButton>
        {companyConfig.phone ? (
          <a className="button buttonSecondary" href={`tel:${companyConfig.phone.replace(/\s/g, "")}`}>
            <Phone aria-hidden="true" size={18} />
            {homeContent.finalCta.secondary}
          </a>
        ) : (
          <a className="button buttonSecondary" href={`mailto:${companyConfig.contactEmail}`}>
            Scrie-ne pe e-mail
          </a>
        )}
      </div>
    </section>
  );
}
