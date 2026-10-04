import SectionHeading from "../section-heading";
import SectionFade from "../cv-portfolio/section-fade";
import SectionLabel from "../job-search/section-label";
import IconCard from "../icon-card";
import { stagesIntroduction, supportSections } from "./content";
import { stageIcons, stageTones } from "./icons";

export default function SupportStages() {
  return (
    <section aria-labelledby="support-stages" className="relative isolate pb-12 sm:pb-16 lg:pb-20">
      <SectionFade />
      <SectionLabel>Этапы сопровождения</SectionLabel>
      <SectionHeading id="support-stages">Как проходит сопровождение?</SectionHeading>
      <p className="mt-7 max-w-3xl text-lg leading-relaxed text-neutral-600">{stagesIntroduction}</p>
      <ul className="mt-10 grid gap-4 lg:grid-cols-2">
        {supportSections.map(({ id, title, paragraphs }, index) => (
          <IconCard key={id} icon={stageIcons[index]} tone={stageTones[index]} title={title} paragraphs={paragraphs} />
        ))}
      </ul>
    </section>
  );
}
