"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { VideoCallIcon } from "@/app/components/svg";
import useCallRingtone from "../../components/calls/use-call-ringtone";

export default function IncomingCalls() {
  const [calls, setCalls] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState("");
  const [accepting, setAccepting] = useState<string | null>(null);
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const callUpdateVersion = useRef(0);
  const headingId = useId();
  const pathname = usePathname();
  const incoming = calls.filter((call) => pathname !== `/admin/calls/${call.id}`);
  const { blocked, enableSound } = useCallRingtone(incoming.length > 0);

  useEffect(() => {
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      const version = callUpdateVersion.current;
      try {
        const response = await fetch("/api/calls?incoming=1", { cache: "no-store" });
        if (response.ok) {
          const nextCalls = await response.json();
          if (!stopped && version === callUpdateVersion.current) setCalls(nextCalls);
        }
      } catch {}
      if (!stopped) timer = setTimeout(poll, 3000);
    }
    void poll();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (incoming.length > 0 && !dialog.current?.open) dialog.current?.showModal();
    if (incoming.length === 0) dialog.current?.close();
  }, [incoming.length]);

  async function decline(id: string) {
    callUpdateVersion.current += 1;
    setError("");
    try {
      const response = await fetch("/api/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "decline" }),
      });
      if (!response.ok && response.status !== 409) throw new Error();
      callUpdateVersion.current += 1;
      setCalls((current) => current.filter((call) => call.id !== id));
    } catch {
      setError("Не удалось отклонить звонок. Попробуйте ещё раз.");
    } finally {
      callUpdateVersion.current += 1;
    }
  }

  async function accept(id: string) {
    callUpdateVersion.current += 1;
    setAccepting(id);
    setError("");
    try {
      const response = await fetch("/api/calls", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "accept" }),
      });
      if (!response.ok) throw new Error();
      callUpdateVersion.current += 1;
      setCalls((current) => current.filter((call) => call.id !== id));
      router.push(`/admin/calls/${id}`);
    } catch {
      setError("Не удалось принять звонок. Возможно, клиент завершил его.");
    } finally {
      callUpdateVersion.current += 1;
      setAccepting(null);
    }
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby={headingId}
      onCancel={(event) => event.preventDefault()}
      className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl border border-brand-100 bg-white p-4 text-neutral-800 shadow-2xl backdrop:bg-neutral-950/50 backdrop:backdrop-blur-sm sm:p-8"
    >
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-500 motion-safe:animate-pulse sm:size-16">
        <VideoCallIcon className="size-6 sm:size-8" />
      </div>
      <h2 id={headingId} className="mt-4 break-words text-center text-base font-semibold sm:text-xl sm:mt-5 sm:text-2xl">Входящий видеозвонок</h2>
      <p className="mt-2 text-center text-sm text-neutral-500 sm:text-lg">Клиент ожидает вашего ответа</p>
      {blocked && (
        <button type="button" onClick={enableSound} className="mx-auto mt-3 block text-sm text-brand-600 underline">
          Включить звук звонка
        </button>
      )}
      {incoming.map((call) => (
        <div key={call.id} className="mt-4 rounded-2xl bg-brand-50 p-3 sm:mt-6 sm:p-4">
          <p className="break-words text-center text-base font-semibold sm:text-xl">{call.name || "Клиент"}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:mt-4 sm:gap-3">
            <button type="button" disabled={accepting !== null} onClick={() => void accept(call.id)} className="rounded-xl bg-brand-500 px-3 py-2 text-sm sm:px-5 sm:py-3 sm:text-lg font-medium text-white hover:bg-brand-600 disabled:opacity-50">{accepting === call.id ? "Подключаемся…" : "Принять"}</button>
            <button type="button" onClick={() => void decline(call.id)} className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm sm:px-5 sm:py-3 sm:text-lg text-neutral-600 hover:bg-neutral-100">Отклонить</button>
          </div>
        </div>
      ))}
      {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
    </dialog>
  );
}
