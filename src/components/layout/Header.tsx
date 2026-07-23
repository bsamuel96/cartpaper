import Link from "next/link";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { navItems } from "@/content/siteContent";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { QuoteButton } from "@/components/quote/QuoteButton";

export function Header() {
  return (
    <header className="siteHeader">
      <svg className="glassFilterSvg" aria-hidden="true" focusable="false">
        <filter id="liquid-glass-refraction" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.038" numOctaves="2" seed="7" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="1.2" result="softNoise" />
          <feDisplacementMap in="SourceGraphic" in2="softNoise" scale="18" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <a className="skipLink" href="#main-content">
        Sari la conținut
      </a>
      <div className="headerInner">
        <Link className="brandLink" href="/" aria-label="Cartpaper acasă">
          <BrandLockup variant="light" priority />
        </Link>
        <nav className="desktopNav" aria-label="Navigare principală">
          {navItems.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="headerActions">
          <QuoteButton className="button buttonPrimary desktopOnly">Cere ofertă</QuoteButton>
          <MobileMenu variant="light" />
        </div>
      </div>
    </header>
  );
}
