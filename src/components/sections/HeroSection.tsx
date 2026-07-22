import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homeContent } from "@/content/siteContent";
import { QuoteButton } from "@/components/quote/QuoteButton";

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
            <ArrowRight aria-hidden="true" size={18} />
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
      <div className="heroVisual" aria-label="Previzualizare pungă personalizată">
        <Image
          src="/mockups/kraft-classic/base.webp"
          width={1200}
          height={1500}
          priority
          alt="Pungă de hârtie kraft cu spațiu de personalizare"
        />
        <div className="heroLogoPreview">
          <Image
            src="/brand/cartpaper-icon-light-surface.png"
            width={2000}
            height={2000}
            alt=""
            aria-hidden="true"
          />
        </div>
        <span className="heroQuantityBadge">{homeContent.hero.quantityBadge}</span>
      </div>
    </section>
  );
}
