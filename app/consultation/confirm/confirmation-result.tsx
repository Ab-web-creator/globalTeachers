"use client";

import Link from "next/link";
import { AboutBenefitCheckIcon, EnvelopeIcon } from "@/app/components/svg";
import { useEffect, useRef, useState } from "react";

export default function ConfirmationResult() {
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
      {status === "loading" && <p>Подтверждаем ваш email…</p>}
      {status === "success" && (
        <>
          <div className="flex items-start gap-4 sm:items-center sm:gap-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 ring-1 ring-brand-100 sm:size-12">
              <AboutBenefitCheckIcon className="size-5 text-brand-500 sm:size-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-semibold leading-tight tracking-tight text-brand-950">Электронная почта подтверждена!</h1>
              <p className="mt-2 text-base leading-relaxed text-neutral-600">Спасибо за обращение в <strong className="font-semibold text-brand-700">TeacherNavigator!</strong></p>
            </div>
          </div>
          <p className="mt-5 text-base leading-relaxed text-neutral-600 sm:text-lg">Мы рассмотрим вашу анкету и свяжемся с вами, чтобы обсудить дальнейшие шаги.</p>
          <div className="mt-7 flex items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 p-3 sm:p-5">
            <EnvelopeIcon className="mt-1 size-5 shrink-0 text-brand-500" />
            <p className="text-base leading-relaxed text-brand-700">Мы также отправим вам письмо с дополнительной информацией.</p>
          </div>
          <p className="mt-7 text-base font-medium text-brand-700">До скорой связи!</p>
        </>
      )}
      {status === "error" && (
        <>
          <h1 className="text-xl font-semibold">Не удалось подтвердить email</h1>
          <p className="mt-4 leading-relaxed">{error}</p>
          <div className="mt-5 flex flex-wrap gap-4">
            <button type="button" onClick={() => void confirm(token.current)} className="text-brand-600 underline">Попробовать снова</button>
            <Link href="/consultation" className="text-brand-600 underline">Заполнить заявку</Link>
          </div>
        </>
      )}
      {status !== "loading" && <Link href="/" className="action-gradient mt-8 inline-flex min-h-12 w-fit items-center justify-center rounded-xl px-5 py-3 text-center text-base font-semibold text-white transition-shadow hover:shadow-md focus-visible:-outline-offset-2">Вернуться на главную</Link>}
    </section>
  );
}
