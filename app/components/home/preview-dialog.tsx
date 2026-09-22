import type { RefObject } from "react";
import BookIcon from "./book-icon";
import { panels, type Panel } from "./content";

type PreviewDialogProps = {
  dialog: RefObject<HTMLDialogElement | null>;
  panel: Panel;
};

export default function PreviewDialog({ dialog, panel }: PreviewDialogProps) {
  return (
    <dialog ref={dialog} aria-labelledby="panel-title" className="fixed inset-0 m-auto w-[calc(100%-3rem)] max-w-lg rounded-3xl bg-white p-8 text-[#191919] shadow-2xl backdrop:bg-[#002e3b]/45" onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="flex items-start justify-between gap-5">
        <BookIcon className="mb-6 h-10 w-11 text-[#00566b]" />
        <button onClick={() => dialog.current?.close()} aria-label="Close preview" className="rounded-full bg-[#edf5f7] px-3 py-1 text-2xl text-[#00566b]">×</button>
      </div>
      <h2 id="panel-title" className="text-3xl font-semibold tracking-tight">{panels[panel].title}</h2>
      <p className="mt-4 leading-7 text-[#616161]">{panels[panel].text}</p>
      {panel === "Courses" && <ul className="mt-6 grid gap-3 sm:grid-cols-2">{["Design & creativity", "Business & leadership", "Technology & coding", "Languages & culture"].map((category) => <li key={category} className="rounded-xl bg-[#edf5f7] p-4 text-sm font-medium text-[#00566b]">{category}</li>)}</ul>}
    </dialog>
  );
}
