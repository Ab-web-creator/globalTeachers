import { Caveat } from "next/font/google";
import NoteBackdrop from "./note-backdrop";

const caveat = Caveat({ subsets: ["cyrillic"], weight: "500", preload: false });

export default function HandwrittenNote({ children }: { children: string }) {
  return (
    <div aria-hidden="true" className="relative grid aspect-square w-full max-w-md place-items-center">
      <NoteBackdrop />
      <div className={`${caveat.className} relative max-w-52 -rotate-6 text-3xl leading-tight text-brand-500`}>
        <p>
          {children}{" "}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="inline size-6 align-baseline">
            <path d="M12 20s-7-4.4-7-9.6A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.4C19 15.6 12 20 12 20Z" />
          </svg>
        </p>
        <svg viewBox="0 0 100 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mt-3 ml-8 w-28">
          <path d="M2 10C30 4 60 2 98 2" />
        </svg>
      </div>
    </div>
  );
}
