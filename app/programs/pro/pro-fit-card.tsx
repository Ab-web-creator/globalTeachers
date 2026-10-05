import type { ReactNode } from "react";
import LineIcon from "../../services/components/line-icon";
import ProFitArt from "./pro-fit-art";
import type { CardIllustration } from "./card-illustrations";

type Props = {
  id: string;
  title: string;
  icon: string;
  note: string;
  variant: CardIllustration;
  children: ReactNode;
  headingLevel?: "h2" | "h3";
};

export default function ProFitCard({ id, title, icon, note, variant, children, headingLevel: Heading = "h2" }: Props) {
  return (
    <div className="group relative isolate overflow-hidden rounded-3xl border border-brand-100 bg-white/90 p-6 pb-20 shadow-sm shadow-brand-500/5 transition-colors duration-300 hover:border-brand-200 hover:bg-brand-100/50 hover:shadow-lg hover:shadow-brand-500/10 motion-reduce:transition-none sm:p-8 sm:pb-24">
      <div className="mb-6 flex items-start justify-between gap-4">
        <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-200/60 text-brand-600 transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-white motion-reduce:transition-none">
          <LineIcon path={icon} className="size-7" />
        </span>
        <span aria-hidden="true" style={{ fontFamily: '"Segoe Print", "Bradley Hand", cursive' }} className="max-w-40 -rotate-6 text-right text-base italic leading-snug text-neutral-400">{note}</span>
      </div>
      <Heading id={id} className="relative z-10 mb-7 text-xl font-semibold leading-snug tracking-tight text-brand-950">{title}</Heading>
      <div className="relative z-10 space-y-5 text-base leading-relaxed text-neutral-600">{children}</div>
      <ProFitArt variant={variant} />
    </div>
  );
}
