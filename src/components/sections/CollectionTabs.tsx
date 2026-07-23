"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useRef, useState } from "react";
import { homeContent } from "@/content/siteContent";
import { getMockupPreset } from "@/data/mockups";

export function CollectionTabs() {
  const [activeId, setActiveId] = useState(homeContent.collection.tabs[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = homeContent.collection.tabs.find((tab) => tab.id === activeId) ?? homeContent.collection.tabs[0];
  const mockup = getMockupPreset(active.mockupId);
  const activeIndex = homeContent.collection.tabs.findIndex((tab) => tab.id === active.id);

  function focusTab(index: number) {
    const nextIndex = (index + homeContent.collection.tabs.length) % homeContent.collection.tabs.length;
    const next = homeContent.collection.tabs[nextIndex];
    setActiveId(next.id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <section className="pageBand collectionBand" id="colectie" aria-labelledby="collection-title">
      <p className="overline">{homeContent.collection.overline}</p>
      <h2 id="collection-title">{homeContent.collection.title}</h2>
      <div className="tabs" role="tablist" aria-label="Colecție pungi">
        {homeContent.collection.tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={`tab-${tab.id}`}
            role="tab"
            type="button"
            aria-selected={active.id === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={active.id === tab.id ? 0 : -1}
            onClick={() => setActiveId(tab.id)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                focusTab(activeIndex + 1);
              } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                focusTab(activeIndex - 1);
              } else if (event.key === "Home") {
                event.preventDefault();
                focusTab(0);
              } else if (event.key === "End") {
                event.preventDefault();
                focusTab(homeContent.collection.tabs.length - 1);
              }
            }}
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
          <Link className="button buttonSecondary collectionCta" href={`/personalizeaza?model=${mockup.id}`}>
            Testează varianta
            <ShoppingBag aria-hidden="true" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
