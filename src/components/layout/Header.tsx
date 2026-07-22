import Image from "next/image";
import Link from "next/link";
import { navItems } from "@/content/siteContent";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { QuoteButton } from "@/components/quote/QuoteButton";

export function Header() {
  return (
    <header className="siteHeader">
      <a className="skipLink" href="#main-content">
        Sari la conținut
      </a>
      <div className="headerInner">
        <Link className="brandLink" href="/" aria-label="Cartpaper acasă">
          <Image
            src="/brand/cartpaper-wordmark-light-surface.png"
            width={2000}
            height={2000}
            alt="Cartpaper.ro"
            priority
          />
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
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
