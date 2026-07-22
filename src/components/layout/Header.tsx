import Link from "next/link";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { navItems } from "@/content/siteContent";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { QuoteButton } from "@/components/quote/QuoteButton";

export function Header() {
  return (
    <header className="siteHeader adaptiveHeader">
      <a className="skipLink" href="#main-content">
        Sari la conținut
      </a>
      <div className="headerInner">
        <Link className="brandLink" href="/" aria-label="Cartpaper acasă">
          <BrandLockup className="brandHeaderLight" variant="light" priority />
          <BrandLockup className="brandHeaderDark" variant="dark" priority />
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
