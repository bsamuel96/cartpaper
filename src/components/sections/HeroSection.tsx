import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { homeContent } from "@/content/siteContent";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { HeroBagDeck } from "@/components/sections/HeroBagDeck";
import { RevealText } from "@/components/motion/RevealText";

export function HeroSection() {
  return (
    <section className="heroSection" data-header-theme="light" aria-labelledby="hero-title">
      <div className="heroCopy">
        <p className="overline">{homeContent.hero.badge}</p>
        <h1 id="hero-title">
          <RevealText>{homeContent.hero.titleStart}</RevealText> <span>{homeContent.hero.titleAccent}</span>
        </h1>
        <p className="heroBody">{homeContent.hero.body}</p>
        <div className="heroActions">
          <Link className="button buttonPrimary" href="/personalizeaza">
            {homeContent.hero.primaryCta}
            <ShoppingBag aria-hidden="true" size={18} />
          </Link>
          <QuoteButton className="button buttonSecondary">{homeContent.hero.secondaryCta}</QuoteButton>
        </div>
        <div className="heroChips" aria-label="Opțiuni populare">
          {homeContent.hero.chips.map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
        </div>
        <dl className="statsStrip" aria-label="Indicatori provizorii">
          {homeContent.stats.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.value}</dt>
              <dd>
                {stat.label}
                {!stat.verified ? <span>neconfirmat</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <HeroBagDeck />
    </section>
  );
}
