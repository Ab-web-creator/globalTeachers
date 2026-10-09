"use client";

import { EditApplicationIcon } from "@/app/components/svg";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createPortal } from "react-dom";
import type { Answers } from "../../consultation/components/form-fields";
import ApplicationEditDialog from "./application-edit-dialog";

type Props = { id: string; status: "pending" | "confirmed"; answers: Answers; };

export default function EditApplicationButton({ id, status, answers }: Props) {
  const [open, setOpen] = useState(false);
  const [refreshing, startTransition] = useTransition();
  const router = useRouter();
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} disabled={refreshing} aria-haspopup="dialog" aria-label={`Редактировать заявку: ${answers.name}`} title="Редактировать" className="flex size-10 shrink-0 items-center justify-center rounded-xl text-neutral-500 transition-colors hover:bg-brand-50 hover:text-brand-600 disabled:opacity-50">
        <EditApplicationIcon />
      </button>
      {open && createPortal(<ApplicationEditDialog id={id} status={status} answers={answers} onClose={() => setOpen(false)} onSaved={() => startTransition(() => router.refresh())} />, document.body)}
    </>
  );
}
