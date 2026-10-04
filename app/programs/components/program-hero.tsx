import type { ReactNode } from "react";
import PageTitle from "../../services/components/page-title";
import SectionLabel from "../../services/components/job-search/section-label";
import ServiceHero from "../../services/components/service-hero";

type Props = { tier: string; image: string; title: ReactNode; intro: readonly string[]; highlight: string; imageAspectRatio?: string };

export default function ProgramHero({ tier, image, title, intro, highlight, imageAspectRatio }: Props) {
  return (
    <ServiceHero image={image} backHref="/#programs" imageAspectRatio={imageAspectRatio} stretchImage={!imageAspectRatio}>
      <SectionLabel>Программа {tier}</SectionLabel>
      <PageTitle>{title}</PageTitle>
      <div className="mt-6 space-y-5">
        {intro.map((text) => <p key={text} className="text-base leading-relaxed text-neutral-600 sm:text-lg">{text}</p>)}
      </div>
      <p className="mt-5 border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-700">{highlight}</p>
    </ServiceHero>
  );
}
