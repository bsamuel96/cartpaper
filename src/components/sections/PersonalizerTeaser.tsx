import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { BeforeAfterPreview } from "@/components/sections/BeforeAfterPreview";
import { homeContent } from "@/content/siteContent";

export function PersonalizerTeaser() {
  return (
    <section className="personalizerTeaser" id="servicii" data-header-theme="dark" aria-labelledby="personalizer-teaser-title">
      <div>
        <p className="overline">{homeContent.personalizer.overline}</p>
        <h2 id="personalizer-teaser-title">{homeContent.personalizer.title}</h2>
        <p>{homeContent.personalizer.body}</p>
        <Link className="button buttonPrimary" href="/personalizeaza">
          {homeContent.personalizer.cta}
          <ShoppingBag aria-hidden="true" size={18} />
        </Link>
      </div>
      <BeforeAfterPreview />
    </section>
  );
}
