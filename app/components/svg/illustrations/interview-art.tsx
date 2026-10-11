import type { SVGProps } from "react";
import { interviewNotesMaskUrl } from "../assets";

export function InterviewNotesIllustration(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 88 1024 1380" preserveAspectRatio="xMidYMax meet" className="absolute inset-0 h-full w-full" {...svgProps}>
      <image href="/images/interview-notes-cutout.webp" width="1024" height="1536" style={{ maskImage: `url(${interviewNotesMaskUrl})`, maskSize: "100% 100%", maskRepeat: "no-repeat" }} />
    </svg>
  );
}
