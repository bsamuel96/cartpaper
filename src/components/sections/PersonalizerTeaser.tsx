import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homeContent } from "@/content/siteContent";
import { mockupPresets } from "@/data/mockups";

export function PersonalizerTeaser() {
  return (
    <section className="personalizerTeaser" id="servicii" aria-labelledby="personalizer-teaser-title">
      <div>
        <p className="overline">{homeContent.personalizer.overline}</p>
        <h2 id="personalizer-teaser-title">{homeContent.personalizer.title}</h2>
        <p>{homeContent.personalizer.body}</p>
        <Link className="button buttonPrimary" href="/personalizeaza">
          {homeContent.personalizer.cta}
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
      <div className="teaserScroller" aria-label="Tipuri de pungi disponibile">
        {mockupPresets.map((mockup) => (
          <article className="teaserMockup" key={mockup.id}>
            <Image src={mockup.thumbnailSrc} width={480} height={600} alt={mockup.accessibleDescription} />
            <h3>{mockup.label}</h3>
            <p>{mockup.shortDescription}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
