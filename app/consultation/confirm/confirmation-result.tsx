"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import Link from "next/link";
import { AboutBenefitCheckIcon, EnvelopeIcon } from "@/app/components/svg";
import { useEffect, useRef, useState } from "react";

export default function ConfirmationResult() {
  const t = useTranslations();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState("");
  const token = useRef("");

  async function confirm(value: string) {
    setStatus("loading");
    try {
      const response = await fetch("/api/consultation/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: value }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Не удалось подтвердить email.");
      window.history.replaceState(null, "", window.location.pathname);
      setStatus("success");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Проверьте соединение и попробуйте ещё раз.");
      setStatus("error");
    }
  }

  useEffect(() => {
    token.current = window.location.hash.slice(1);
    void confirm(token.current);
  }, []);

  return (
    <section role="status" aria-live="polite" className="w-full max-w-lg bg-white px-6 py-6 sm:rounded-3xl sm:border sm:border-brand-100 sm:p-10 sm:shadow-xl sm:shadow-brand-950/5">
      {status === "loading" && <p>{t("consultation.confirm.confirmationResult.message0663")}</p>}
      {status === "success" && (
        <>
          <div className="flex items-start gap-4 sm:items-center sm:gap-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 ring-1 ring-brand-100 sm:size-12">
              <AboutBenefitCheckIcon className="size-5 text-brand-500 sm:size-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-semibold leading-tight tracking-tight text-brand-950">{t("consultation.confirm.confirmationResult.message0664")}</h1>
              <p className="mt-2 text-base leading-relaxed text-neutral-600">{t("consultation.confirm.confirmationResult.message0665")}{" "}<strong className="font-semibold text-brand-700">TeacherNavigator!</strong></p>
            </div>
          </div>
          <p className="mt-5 text-base leading-relaxed text-neutral-600 sm:text-lg">{t("consultation.confirm.confirmationResult.message0666")}</p>
          <div className="mt-7 flex items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 p-3 sm:p-5">
            <EnvelopeIcon className="mt-1 size-5 shrink-0 text-brand-500" />
            <p className="text-base leading-relaxed text-brand-700">{t("consultation.confirm.confirmationResult.message0667")}</p>
          </div>
          <p className="mt-7 text-base font-medium text-brand-700">{t("consultation.confirm.confirmationResult.message0668")}</p>
        </>
      )}
      {status === "error" && (
        <>
          <h1 className="text-xl font-semibold">{t("consultation.confirm.confirmationResult.message0669")}</h1>
          <p className="mt-4 leading-relaxed">{t.content(error)}</p>
          <div className="mt-5 flex flex-wrap gap-4">
            <button type="button" onClick={() => void confirm(token.current)} className="text-brand-600 underline">{t("components.calls.callVideoStage.message0252")}</button>
            <Link href="/consultation" className="text-brand-600 underline">{t("consultation.confirm.confirmationResult.message0670")}</Link>
          </div>
        </>
      )}
      {status !== "loading" && <Link href="/" className="action-gradient mt-8 inline-flex min-h-12 w-fit items-center justify-center rounded-xl px-5 py-3 text-center text-base font-semibold text-white transition-shadow hover:shadow-md focus-visible:-outline-offset-2">{t("consultation.confirm.confirmationResult.message0671")}</Link>}
    </section>
  );
}
