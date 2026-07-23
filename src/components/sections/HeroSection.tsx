import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { homeContent } from "@/content/siteContent";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { HeroBagDeck } from "@/components/sections/HeroBagDeck";

export function HeroSection() {
  return (
    <section className="heroSection" aria-labelledby="hero-title">
      <div className="heroCopy">
        <p className="overline">{homeContent.hero.badge}</p>
        <h1 id="hero-title">
          {homeContent.hero.titleStart} <span>{homeContent.hero.titleAccent}</span>
        </h1>
        <p className="heroBody">{homeContent.hero.body}</p>
        <div className="heroActions">
          <Link className="button buttonPrimary" href="/personalizeaza">
            {homeContent.hero.primaryCta}
            <ShoppingBag aria-hidden="true" size={18} />
          </Link>
          <QuoteButton className="button buttonSecondary">{homeContent.hero.secondaryCta}</QuoteButton>
        </div>
      </div>
      <HeroBagDeck />
    </section>
  );
}
