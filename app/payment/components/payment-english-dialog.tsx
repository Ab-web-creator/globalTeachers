"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { englishNotice } from "../../consultation/components/english-notice";

export default function PaymentEnglishDialog({ onClose }: { onClose: () => void }) {
  const t = useTranslations();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previous = document.activeElement;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (previous instanceof HTMLElement) previous.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      aria-labelledby="payment-english-title"
      aria-describedby="payment-english-reason payment-english-recommendation"
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-3xl border border-brand-100 bg-white p-6 text-brand-700 shadow-2xl backdrop:bg-brand-950/50 sm:p-10"
    >
      <h2 id="payment-english-title" className="text-2xl font-semibold">{t.content(englishNotice.title)}</h2>
      <p id="payment-english-reason" className="mt-7 text-base leading-relaxed text-neutral-600">{t.content(englishNotice.reason)}</p>
      <p id="payment-english-recommendation" className="mt-5 text-base leading-relaxed text-neutral-600">{t.content(englishNotice.recommendation)}</p>
      <div className="mt-7 flex flex-wrap gap-4">
        <Link href="/payment/start" className="inline-flex min-h-12 items-center rounded-xl bg-brand-500 px-5 py-3 text-base font-medium text-white hover:bg-brand-600 focus-visible:-outline-offset-2">{t("payment.paymentEnglishDialog.message1056")}</Link>
        <button type="button" onClick={onClose} className="min-h-12 rounded-xl border border-brand-200 px-5 py-3 text-base font-medium hover:bg-brand-50 focus-visible:-outline-offset-2">{t("common.close")}</button>
      </div>
    </dialog>
  );
}
