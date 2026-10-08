import type { ReactNode } from "react";
import SectionHeading from "../../services/components/section-heading";
import SectionFade from "../../services/components/cv-portfolio/section-fade";
import SectionLabel from "../../services/components/job-search/section-label";

type Props = {
  id: string;
  label: string;
  title: ReactNode;
  fade?: "violet" | "sky" | "rose";
  fadeDirection?: "up" | "down";
  fadeToWhite?: boolean;
  fadeHalfHeight?: boolean;
  fadeQuarterHeight?: boolean;
  aside?: ReactNode;
  // Decorative art pinned to the section's top right corner on lg, behind the content.
  decoration?: ReactNode;
  // "end" lines the bottom of `aside` up with the bottom of the text column on lg.
  asideAlign?: "center" | "end";
  children?: ReactNode;
  footer?: ReactNode;
};

// A full-width page section: optional gradient fade, eyebrow, heading, then content; `aside` sits in a second column on lg.
export default function ProgramSection({ id, label, title, fade, fadeDirection = "up", fadeToWhite = false, fadeHalfHeight = false, fadeQuarterHeight = false, aside, asideAlign = "center", decoration, children, footer }: Props) {
  const header = (
    <>
      <SectionLabel>{label}</SectionLabel>
      <SectionHeading id={id}>{title}</SectionHeading>
    </>
  );

  return (
    <section aria-labelledby={id} className={`relative isolate py-12 sm:py-16 lg:py-20 ${aside ? "grid items-center gap-10 lg:grid-cols-2 lg:gap-x-16" : ""}`}>
      {fade && <SectionFade tone={fade} direction={fadeDirection} toWhite={fadeToWhite} halfHeight={fadeHalfHeight} quarterHeight={fadeQuarterHeight} />}
      {decoration && <div aria-hidden="true" className="pointer-events-none absolute top-20 right-0 -z-10 hidden lg:block">{decoration}</div>}
      {aside ? (
        <>
          <div>{header}{children}</div>
          <div className={asideAlign === "end" ? "lg:self-end" : ""}>{aside}</div>
        </>
      ) : (
        <>{header}{children}</>
      )}
      {footer && <div className={aside ? "lg:col-span-2" : "mt-10"}>{footer}</div>}
    </section>
  );
}
