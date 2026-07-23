import { CheckCircle2, ClipboardList, ScanSearch } from "lucide-react";
import { homeContent } from "@/content/siteContent";

const icons = [ScanSearch, ClipboardList, CheckCircle2];

export function CapabilityRail() {
  return (
    <section className="trustSection" aria-label="Repere Cartpaper">
      <div className="trustGrid">
        {homeContent.trustPoints.map(({ title, body }, index) => {
          const Icon = icons[index];
          return (
          <article className="trustItem" key={title}>
            <Icon aria-hidden="true" size={22} />
            <div>
              <strong>{title}</strong>
              <small>{body}</small>
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
}
