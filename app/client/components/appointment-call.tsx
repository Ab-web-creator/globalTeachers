"use client";

import { useEffect, useRef, useState } from "react";
import useCallRingtone from "../../components/calls/use-call-ringtone";
import { VideoCallIcon, PhoneCallIcon } from "@/app/components/svg";
import CallRoom from "../../components/calls/call-room";
import type { AppointmentSlot } from "../../../lib/client-area/types";

type Room = { id: string; token: string; name: string; expires: string };

export default function AppointmentCall({
  bookings,
}: {
  bookings: AppointmentSlot[];
}) {
  const [incoming, setIncoming] = useState<Room | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [now, setNow] = useState(0);
  const [room, setRoom] = useState<Room | null>(null);
  const { blocked, enableSound } = useCallRingtone(!!incoming && !room);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const update = () => setNow(Date.now());
    const initial = window.setTimeout(update, 0);
    const timer = window.setInterval(update, 1000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    let stopped = false;
    async function poll() {
      try {
        const response = await fetch("/api/client/call", { cache: "no-store" });
        if (!response.ok) return;
        const result = await response.json();
        if (!stopped) setIncoming(result.incoming);
      } catch {}
    }
    void poll();
    const timer = window.setInterval(() => void poll(), 3000);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    if (incoming && !room && !dialog.current?.open) dialog.current?.showModal();
    if (!incoming || room) dialog.current?.close();
  }, [incoming, room]);
  async function answer(kind: "accept" | "decline") {
    if (!incoming || busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/calls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-call-token": incoming.token,
        },
        body: JSON.stringify({ id: incoming.id, action: kind }),
      });
      if (!response.ok)
        throw new Error(
          "Не удалось ответить на звонок. Возможно, он уже завершён.",
        );
      if (kind === "accept") setRoom(incoming);
      setIncoming(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Ошибка звонка.");
    } finally {
      setBusy(false);
    }
  }
  const current = bookings.find(
    (slot) =>
      new Date(slot.starts_at).getTime() <= now &&
      new Date(slot.ends_at).getTime() > now,
  );

  async function openCall() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/client/call", { method: "POST" });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Не удалось открыть звонок.");
      setRoom(result);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Не удалось открыть звонок.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      aria-labelledby="appointment-call-title"
      className="relative min-w-0 overflow-hidden rounded-3xl border border-brand-400/30 bg-linear-to-br from-brand-600 to-brand-950 p-5 text-white shadow-lg shadow-brand-500/10 sm:p-7"
    >
      <dialog
        ref={dialog}
        aria-labelledby="incoming-appointment-title"
        onCancel={(event) => event.preventDefault()}
        className="fixed inset-0 m-auto w-full max-w-md rounded-3xl border border-brand-100 bg-white p-6 text-brand-950 shadow-xl backdrop:bg-neutral-950/50"
      >
        <h2 id="incoming-appointment-title" className="text-xl font-semibold">
          Входящий звонок
        </h2>
        <p className="mt-4 text-base">
          Вам звонит администратор TeacherNavigator.
        </p>
        {blocked && (
          <button
            type="button"
            onClick={enableSound}
            className="mt-3 text-brand-600 underline"
          >
            Включить звук
          </button>
        )}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => void answer("accept")}
            className="rounded-xl bg-brand-500 px-5 py-3 text-white disabled:opacity-50"
          >
            Принять
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void answer("decline")}
            className="rounded-xl border border-brand-200 px-5 py-3 disabled:opacity-50"
          >
            Отклонить
          </button>
        </div>
        {error && (
          <p role="alert" className="relative mt-4 text-sm text-red-300">
            {error}
          </p>
        )}
      </dialog>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -right-16 size-64 rounded-full border border-white/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -bottom-32 size-80 rounded-full border border-white/10"
      />
      <div className="relative flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10">
          <VideoCallIcon className="size-6" />
        </span>
        <h2
          id="appointment-call-title"
          className="font-serif text-2xl sm:text-3xl"
        >
          Звонок администратору
        </h2>
      </div>
      <p className="relative mt-7 text-base leading-relaxed text-white/80">
        Позвонить можно во время вашей забронированной консультации. Разрешите
        доступ к камере и микрофону, затем нажмите «Позвонить» в окне
        видеосвязи.
      </p>
      <button
        type="button"
        disabled={!current || busy}
        onClick={() => {
          void openCall();
        }}
        className="relative mt-5 inline-flex min-h-12 w-fit items-center gap-3 rounded-full border border-white/30 bg-white px-6 py-3 text-base font-semibold text-brand-600 transition-colors hover:bg-brand-100 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/10 disabled:text-white/45"
      >
        {busy ? "Подключаемся…" : "Позвонить"}
        <PhoneCallIcon className="size-5" />
      </button>
      {!current && (
        <p className="relative mt-4 text-sm text-white/60">
          Кнопка станет доступна в начале вашей встречи.
        </p>
      )}
      {error && (
        <p role="alert" className="relative mt-4 text-sm text-red-300">
          {error}
        </p>
      )}
      {room && new Date(room.expires).getTime() > now && (
        <div className="relative mt-6 text-brand-700">
          <CallRoom {...room} onDismiss={() => setRoom(null)} />
        </div>
      )}
    </section>
  );
}
