import type { SVGProps } from "react";
import { programIconPaths } from "../data/program-icon-paths";

const paths = {
  profile: programIconPaths.profile,
  globe: programIconPaths.globe,
  checklist: programIconPaths.checklist,
  partnership: "M3 5 1 14l4 4 3-1 5 4 8-7-2-9-5-2-4 2-7 0Z M10 5l-4 5 2 2 4-3 6 6 M5 14l5 5 M8 12l6 6 M16 4l3 1",
};

export function ConsultationBenefitIcon({ kind, ...props }: SVGProps<SVGSVGElement> & { kind: keyof typeof paths }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d={paths[kind]} />
    </svg>
  );
}
