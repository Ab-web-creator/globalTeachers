import IconPanel from "../../services/components/cv-portfolio/icon-panel";
import { approach, audience } from "./content";

export default function StartAudience() {
  return (
    <section aria-labelledby="start-approach start-audience" className="relative left-1/2 w-screen -translate-x-1/2 bg-linear-to-r from-blue-50 to-violet-100 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-400 gap-6 px-6 sm:px-10 lg:grid-cols-2 lg:px-16 xl:px-20">
        <IconPanel as="div" id="start-approach" title="Именно для этого создан START" icon="checklist" tone="white">
          {approach.paragraphs.map((text) => <p key={text} className="mt-4 text-lg leading-relaxed text-neutral-600">{text}</p>)}
        </IconPanel>
        <IconPanel as="div" id="start-audience" title="Кому подходит START?" icon="handshake" tone="white">
          {audience.paragraphs.map((text) => <p key={text} className="mt-4 max-w-lg text-lg leading-relaxed text-neutral-600">{text}</p>)}
          <p className="mt-6 text-lg font-medium leading-relaxed text-brand-600">{audience.note}</p>
        </IconPanel>
      </div>
    </section>
  );
}
