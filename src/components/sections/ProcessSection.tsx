import { Upload, Palette, Send } from "lucide-react";
import { homeContent } from "@/content/siteContent";

const icons = [Upload, Palette, Send];

export function ProcessSection() {
  return (
    <section className="pageBand" id="proces" aria-labelledby="process-title">
      <p className="overline">{homeContent.process.overline}</p>
      <h2 id="process-title">{homeContent.process.title}</h2>
      <div className="processGrid">
        {homeContent.process.steps.map((step, index) => {
          const Icon = icons[index];
          return (
            <article className="processCard" key={step.title}>
              <span className="stepIcon" aria-hidden="true">
                <Icon size={22} />
              </span>
              <span className="stepNumber">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
