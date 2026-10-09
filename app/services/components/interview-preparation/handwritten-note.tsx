import { HandwrittenHeartIcon, HandwrittenNoteUnderline, InterviewNoteBackdrop } from "@/app/components/svg";
import { Caveat } from "next/font/google";

const caveat = Caveat({ subsets: ["cyrillic"], weight: "500", preload: false });

export default function HandwrittenNote({ children }: { children: string; }) {
  return (
    <div aria-hidden="true" className="relative grid aspect-square w-full max-w-md place-items-center">
      <InterviewNoteBackdrop />
      <div className={`${caveat.className} relative max-w-52 -rotate-6 text-3xl leading-tight text-brand-500`}>
        <p>
          {children}{" "}
          <HandwrittenHeartIcon />
        </p>
        <HandwrittenNoteUnderline />
      </div>
    </div>
  );
}
