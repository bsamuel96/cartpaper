import { ShieldCheck, Sparkles, SwatchBook, TimerReset } from "lucide-react";
import { DragMarquee } from "@/components/motion/DragMarquee";

const capabilities = [
  { label: "Simulare pe loc", body: "Previzualizare mobilă înainte de ofertă.", Icon: Sparkles },
  { label: "Finisaje tactile", body: "Mat, alb, folie, relief și lac selectiv.", Icon: SwatchBook },
  { label: "Date verificate", body: "Placeholder-ele sunt blocate la producție.", Icon: ShieldCheck },
  { label: "Răspuns ordonat", body: "Brief-ul ajunge cu configurația completă.", Icon: TimerReset },
];

export function CapabilityRail() {
  return (
    <section className="capabilityRailSection" data-header-theme="light" aria-label="Capabilități Cartpaper">
      <DragMarquee className="capabilityRail">
        {capabilities.map(({ label, body, Icon }) => (
          <article className="capabilityPill" key={label}>
            <Icon aria-hidden="true" size={22} />
            <span>
              <strong>{label}</strong>
              <small>{body}</small>
            </span>
          </article>
        ))}
      </DragMarquee>
    </section>
  );
}
