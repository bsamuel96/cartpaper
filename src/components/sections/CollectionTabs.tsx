"use client";

import { useState } from "react";
import { homeContent } from "@/content/siteContent";

export function CollectionTabs() {
  const [activeId, setActiveId] = useState(homeContent.collection.tabs[0].id);
  const active = homeContent.collection.tabs.find((tab) => tab.id === activeId) ?? homeContent.collection.tabs[0];

  return (
    <section className="pageBand collectionBand" id="colectie" aria-labelledby="collection-title">
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
        <div className="collectionTexture" aria-hidden="true" />
        <div>
          <h3>{active.title}</h3>
          <p>{active.body}</p>
        </div>
      </div>
    </section>
  );
}
