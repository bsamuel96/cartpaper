"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { homeContent } from "@/content/siteContent";
import { getMockupPreset } from "@/data/mockups";

export function CollectionTabs() {
  const [activeId, setActiveId] = useState(homeContent.collection.tabs[0].id);
  const active = homeContent.collection.tabs.find((tab) => tab.id === activeId) ?? homeContent.collection.tabs[0];
  const mockup = getMockupPreset(active.mockupId);

  return (
    <section className="pageBand collectionBand" id="colectie" data-header-theme="light" aria-labelledby="collection-title">
      <p className="overline">{homeContent.collection.overline}</p>
      <h2 id="collection-title">{homeContent.collection.title}</h2>
      <div className="tabs" role="tablist" aria-label="Colecție pungi">
        {homeContent.collection.tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            type="button"
            aria-selected={active.id === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActiveId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="collectionPanel" id={`panel-${active.id}`} role="tabpanel" aria-labelledby={`tab-${active.id}`}>
        <div className="collectionMockup">
          <Image src={mockup.thumbnailSrc} width={480} height={600} alt={mockup.accessibleDescription} />
        </div>
        <div className="collectionCopy">
          <h3>{active.title}</h3>
          <p>{active.body}</p>
          <ul className="collectionDetails">
            {active.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
          <div className="collectionSwatches" aria-label="Paletă orientativă">
            {active.swatches.map((swatch) => (
              <span key={swatch} style={{ background: swatch }} />
            ))}
          </div>
          <Link className="button buttonSecondary collectionCta" href={`/personalizeaza?model=${mockup.id}`}>
            Testează varianta
            <ShoppingBag aria-hidden="true" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
