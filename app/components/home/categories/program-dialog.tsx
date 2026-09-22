import type { RefObject } from "react";
import { programs, type Program } from "./programs";
import ProgramFeatures from "./program-features";

export default function ProgramDialog({ dialog, program }: { dialog: RefObject<HTMLDialogElement | null>; program: Program | null }) {
  return (
    <dialog ref={dialog} aria-labelledby="program-dialog-title" className="fixed inset-0 m-auto max-h-5/6 w-11/12 max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 backdrop:bg-brand-950/50 sm:p-8">
      <button onClick={() => dialog.current?.close()} className="float-right rounded-full bg-brand-50 px-3 py-1 text-2xl text-brand-500" aria-label="Закрыть">×</button>
      <h2 id="program-dialog-title" className="pr-10 text-2xl font-semibold">{program ? `Программа ${program.tier}` : "Все программы"}</h2>
      {(program ? [program] : programs).map((item) => (
        <article key={item.tier} className="mt-6 border-t border-brand-100 pt-5">
          <h3 className="text-lg font-medium">{item.tier} — {item.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">{item.description}</p>
          <ProgramFeatures features={item.features} icons={item.icons} />
        </article>
      ))}
    </dialog>
  );
}
