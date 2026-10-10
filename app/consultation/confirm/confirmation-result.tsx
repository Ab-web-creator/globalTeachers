"use client";

import Link from "next/link";
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
    <section role="status" aria-live="polite" className="w-full max-w-lg rounded-3xl border border-brand-200 bg-white p-8 shadow-sm sm:p-10">
      {status === "loading" && <p>Подтверждаем ваш email…</p>}
      {status === "success" && (
        <>
          <h1 className="text-xl font-bold">Ваша заявка получена!</h1>
          <p className="mt-1 text-lg">Спасибо за обращение в <strong>TeacherNavigator.</strong></p>
          <p className="mt-7 text-lg leading-relaxed">Мы ознакомимся с вашей информацией и свяжемся с вами в ближайшее время, чтобы обсудить следующие шаги.</p>
          <p className="mt-7 text-lg">До скорой связи!</p>
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
      {status !== "loading" && <Link href="/" className="mt-8 inline-block text-lg text-brand-700 hover:text-brand-500">Вернуться на главную →</Link>}
    </section>
  );
}
