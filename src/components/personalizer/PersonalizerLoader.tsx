"use client";

import dynamic from "next/dynamic";

const PersonalizerClient = dynamic(() => import("@/components/personalizer/PersonalizerClient"), {
  ssr: false,
  loading: () => (
    <div className="personalizerShell loadingShell">
      <p className="overline">PERSONALIZATOR</p>
      <h1>Se pregătește editorul...</h1>
    </div>
  ),
});

export function PersonalizerLoader() {
  return <PersonalizerClient />;
}
