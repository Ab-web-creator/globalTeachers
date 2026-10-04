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
  aside?: ReactNode;
  // Decorative art pinned to the section's top right corner on lg, behind the content.
  decoration?: ReactNode;
  // "end" lines the bottom of `aside` up with the bottom of the text column on lg.
  asideAlign?: "center" | "end";
  children?: ReactNode;
  footer?: ReactNode;
};

// A full-width page section: optional gradient fade, eyebrow, heading, then content; `aside` sits in a second column on lg.
export default function ProgramSection({ id, label, title, fade, fadeDirection = "up", aside, asideAlign = "center", decoration, children, footer }: Props) {
  const header = (
    <>
      <SectionLabel>{label}</SectionLabel>
      <SectionHeading id={id}>{title}</SectionHeading>
    </>
  );

  return (
    <section aria-labelledby={id} className={`relative isolate ${fade ? (fadeDirection === "down" ? "py-12 sm:py-16 lg:py-20" : "pb-12 sm:pb-16 lg:pb-20") : ""} ${aside ? "grid items-center gap-10 lg:grid-cols-2 lg:gap-16" : ""}`}>
      {fade && <SectionFade tone={fade} direction={fadeDirection} />}
      {decoration && <div aria-hidden="true" className="pointer-events-none absolute top-0 right-0 -z-10 hidden lg:block">{decoration}</div>}
      {aside ? (
        <>
          <div>{header}{children}</div>
          <div className={asideAlign === "end" ? "lg:self-end" : ""}>{aside}</div>
        </>
      ) : (
        <>{header}{children}</>
      )}
      {footer && <div className={`mt-12 sm:mt-16 lg:mt-20 ${aside ? "lg:col-span-2" : ""}`}>{footer}</div>}
    </section>
  );
}
