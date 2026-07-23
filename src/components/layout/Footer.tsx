import Link from "next/link";
import Image from "next/image";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { companyConfig } from "@/config/companyConfig";
import { navItems } from "@/content/siteContent";
import { CookieSettingsButton } from "@/components/consent/CookieSettingsButton";

export function Footer() {
  const contactHref = `mailto:${companyConfig.contactEmail}`;

  return (
    <footer className="siteFooter" id="contact">
      <div className="footerGrid">
        <div className="footerBrand">
          <BrandLockup variant="footer" />
          <p>Pungi de hârtie personalizate pentru branduri care vor să fie recunoscute din prima atingere.</p>
          {companyConfig.socialLinks.length > 0 ? (
            <div className="footerSocial">
              {companyConfig.socialLinks.map((item) => (
                <a href={item.href} key={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
        <div>
          <h2>Servicii</h2>
          <ul>
            <li>
              <Link href="/personalizeaza">Personalizator pungă</Link>
            </li>
            <li>
              <Link href="/#colectie">Colecție</Link>
            </li>
            <li>
              <Link href="/#proces">Proces</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>Companie</h2>
          <ul>
            {navItems.slice(0, 5).map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Contact</h2>
          <ul>
            <li>
              <a href={contactHref}>{companyConfig.contactEmail}</a>
            </li>
            {companyConfig.phone ? (
              <li>
                <a href={`tel:${companyConfig.phone.replace(/\s/g, "")}`}>{companyConfig.phone}</a>
              </li>
            ) : null}
            {companyConfig.workingHours ? <li>{companyConfig.workingHours}</li> : null}
          </ul>
          <a
            className="anpcLink"
            href="https://reclamatiisal.anpc.ro/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/legal/anpc-sal.png"
              width={250}
              height={50}
              alt="Soluționarea Alternativă a Litigiilor – ANPC"
            />
            <span>Platforma SAL ANPC</span>
          </a>
        </div>
      </div>
      <div className="footerBottom">
        <p>© {new Date().getFullYear()} Cartpaper.</p>
        <div className="footerLegal">
          <Link href="/politica-de-confidentialitate">Confidențialitate</Link>
          <Link href="/politica-de-cookies">Cookies</Link>
          <Link href="/termeni-si-conditii">Termeni</Link>
          <CookieSettingsButton />
        </div>
      </div>
    </footer>
  );
}
