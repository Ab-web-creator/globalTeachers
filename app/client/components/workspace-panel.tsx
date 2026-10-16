"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  ConsultationDetailIcon,
  supportCalendarIconPath,
} from "@/app/components/svg";
import AppointmentCall from "./appointment-call";
import ClientWelcomeSection from "./client-welcome-section";
import PrivateChat from "./private-chat";
import PackageSupportSection from "./package-support-section";
import type { ClientWorkspace } from "../../../lib/client-area/types";

const fieldClass =
  "w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-base focus:outline-2 focus:-outline-offset-2 focus:outline-brand-500";
const buttonClass =
  "inline-flex min-h-12 w-fit items-center justify-center rounded-xl bg-brand-500 px-6 py-3 text-base font-medium text-white hover:bg-brand-600 disabled:cursor-wait disabled:opacity-50";

function slotLabel(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function WorkspacePanel({
  initial,
  admin = false,
}: {
  initial: ClientWorkspace;
  admin?: boolean;
}) {
  const [data, setData] = useState(initial);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [hours, setHours] = useState(String(initial.client.allowance_hours));
  const draftId = useRef("");
  const sending = useRef(false);
  const [timeZone, setTimeZone] = useState("UTC");
  const [selectedSlot, setSelectedSlot] = useState("");
  const endpoint = admin
    ? `/api/admin/clients?client=${initial.client.id}`
    : "/api/client/messages";

  const refresh = useCallback(
    async (signal?: AbortSignal) => {
      const response = await fetch(endpoint, { cache: "no-store", signal });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Не удалось обновить страницу.");
      setData(result);
    },
    [endpoint],
  );

  useEffect(() => {
    // The initial display uses UTC until the browser supplies the visitor's time zone.
    const updateZone = () =>
      setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const controller = new AbortController();
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      void refresh(controller.signal).catch((cause) => {
        if (!controller.signal.aborted)
          setError(
            cause instanceof Error
              ? cause.message
              : "Не удалось обновить страницу.",
          );
      });
    }, 5000);
    const zoneTimer = window.setTimeout(updateZone, 0);
    return () => {
      controller.abort();
      window.clearInterval(timer);
      window.clearTimeout(zoneTimer);
    };
  }, [refresh]);

  const latestMessageId = data.messages.at(-1)?.id;
  useEffect(() => {
    if (!admin || !latestMessageId) return;
    async function markRead() {
      if (document.visibilityState !== "visible") return;
      const response = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "read-chat",
          clientId: data.client.id,
          ids: data.messages.map((item) => item.id),
        }),
      });
      if (response.ok) window.dispatchEvent(new Event("private-chat-read"));
    }
    const read = () => {
      void markRead().catch(() => {});
    };
    read();
    document.addEventListener("visibilitychange", read);
    return () => document.removeEventListener("visibilitychange", read);
  }, [admin, latestMessageId, data.client.id, data.messages]);

  const markClientRead = useCallback(() => {
    void fetch("/api/client/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "read-chat",
        ids: data.messages.map((item) => item.id),
      }),
    })
      .then((response) => {
        if (response.ok) window.dispatchEvent(new Event("client-chat-read"));
      })
      .catch(() => {});
  }, [data.messages]);

  async function post(url: string, body: object) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Не удалось выполнить действие.");
  }

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    if (sending.current || !message.trim()) return;
    sending.current = true;
    setPending(true);
    setError("");
    if (!draftId.current) draftId.current = crypto.randomUUID();
    try {
      await post(admin ? "/api/admin/clients" : "/api/client/messages", {
        ...(admin ? { action: "chat", clientId: data.client.id } : {}),
        id: draftId.current,
        body: message.trim(),
      });
      setMessage("");
      draftId.current = "";
      await refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Не удалось отправить сообщение.",
      );
    } finally {
      sending.current = false;
      setPending(false);
    }
  }

  async function book() {
    if (sending.current || !selectedSlot) return;
    sending.current = true;
    setPending(true);
    setError("");
    setNotice("");
    try {
      await post("/api/client/bookings", {
        slotId: selectedSlot,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      setSelectedSlot("");
      setNotice(
        "Встреча забронирована. Подтверждение отправляется на ваш email.",
      );
      await refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Не удалось забронировать время.",
      );
      await refresh().catch(() => undefined);
    } finally {
      sending.current = false;
      setPending(false);
    }
  }

  async function saveHours(event: FormEvent) {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true;
    setPending(true);
    setError("");
    try {
      await post("/api/admin/clients", {
        action: "client-allowance",
        clientId: data.client.id,
        hours: Number(hours),
      });
      await refresh();
      setNotice("Лимит часов сохранён.");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Не удалось сохранить лимит.",
      );
    } finally {
      sending.current = false;
      setPending(false);
    }
  }

  const remaining = Math.max(
    0,
    data.client.allowance_hours - data.client.booked_hours,
  );
  const format = (value: string) =>
    timeZone === "UTC"
      ? new Intl.DateTimeFormat("ru-RU", {
          dateStyle: "long",
          timeStyle: "short",
          timeZone: "UTC",
        }).format(new Date(value))
      : slotLabel(value);
  return (
    <div>
      {error && (
        <p
          role="alert"
          className="mb-6 rounded-xl bg-red-50 p-4 text-base text-red-700"
        >
          {error}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="mb-6 rounded-xl bg-brand-50 p-4 text-base text-brand-700"
        >
          {notice}
        </p>
      )}
      {!admin && <ClientWelcomeSection name={data.client.name} />}
      <div className="grid items-start gap-6 lg:grid-cols-2">
        {!admin && (
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <AppointmentCall bookings={data.bookings} />
          </div>
        )}
        <div
          className={
            admin ? "min-w-0" : "min-w-0 lg:col-start-1 lg:row-start-2"
          }
        >
          <PrivateChat
            messages={data.messages}
            name={data.client.name}
            admin={admin}
            active={data.client.active}
            timeZone={timeZone}
            draft={message}
            pending={pending}
            onDraftChange={(value) => {
              setMessage(value);
              draftId.current = "";
            }}
            onRead={
              !admin && data.client.client_unread_count
                ? markClientRead
                : undefined
            }
            onSend={sendMessage}
          />
        </div>
        <div className={admin ? "min-w-0" : "min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-2"}>
        <section
          aria-labelledby="private-calendar-title"
          className="rounded-3xl border border-brand-100 bg-white/90 p-5 shadow-sm sm:p-7"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500">
              <ConsultationDetailIcon
                path={supportCalendarIconPath}
                className="size-6"
              />
            </span>
            <h2
              id="private-calendar-title"
              className="font-serif text-3xl text-brand-950"
            >
              Консультации
            </h2>
          </div>
          <p className="mt-7 text-base leading-relaxed text-neutral-600">
            Пакет {data.client.tier} · Доступно {remaining} из{" "}
            {data.client.allowance_hours} ч. Одна встреча длится 60 минут.
          </p>
          {data.client.tier === "PRO" && (
            <p className="mt-3 text-sm text-neutral-500">
              Три встречи проходят в разные дни. Не более одного часа в день по
              календарю {data.booking_time_zone}.
            </p>
          )}
          <p className="mt-3 text-sm text-neutral-500">
            Время указано в часовом поясе {timeZone}.
          </p>
          {admin ? (
            data.client.tier === "VIP" ? (
              <form onSubmit={saveHours} className="mt-6">
                <label
                  htmlFor="client-hours"
                  className="block text-sm font-medium"
                >
                  Всего часов для VIP-клиента (включая первый час)
                </label>
                <input
                  id="client-hours"
                  type="number"
                  min={0}
                  max={1000}
                  step={1}
                  required
                  value={hours}
                  onChange={(event) => setHours(event.target.value)}
                  className={`${fieldClass} mt-2`}
                />
                <button disabled={pending} className={`${buttonClass} mt-3`}>
                  Сохранить лимит
                </button>
              </form>
            ) : (
              <p className="mt-6 text-base text-neutral-500">
                {data.client.tier === "START"
                  ? "START включает одну консультацию продолжительностью 60 минут."
                  : "PRO включает три консультации по 60 минут в разные дни."}
              </p>
            )
          ) : (
            <>
              {remaining === 0 && (
                <p className="mt-6 text-base leading-relaxed text-neutral-500">
                  Сейчас нет доступных часов для записи. Уточните условия у
                  администратора в чате.
                </p>
              )}
              {remaining > 0 && !data.slots.length && (
                <p className="mt-6 text-base leading-relaxed text-neutral-500">
                  Пока нет свободных часов. Администратор откроет время для
                  записи — уточните удобные даты в чате.
                </p>
              )}
              {remaining > 0 && data.slots.length > 0 && (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    void book();
                  }}
                  className="mt-6"
                >
                  <label
                    htmlFor="appointment-slot"
                    className="block text-sm font-medium"
                  >
                    Выберите свободный час
                  </label>
                  <span className="relative mt-2 block">
                    <select
                      id="appointment-slot"
                      required
                      value={selectedSlot}
                      onChange={(event) => setSelectedSlot(event.target.value)}
                      className={`${fieldClass} appearance-none pr-12`}
                    >
                      <option value="">Выберите время</option>
                      {data.slots.map((slot) => (
                        <option key={slot.id} value={slot.id}>
                          {format(slot.starts_at)}
                        </option>
                      ))}
                    </select>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
                    >
                      ⌄
                    </span>
                  </span>
                  <button
                    type="submit"
                    disabled={pending || !selectedSlot}
                    className={`${buttonClass} mt-4`}
                  >
                    Забронировать час
                  </button>
                </form>
              )}
            </>
          )}
          <h3 className="mt-8 text-lg font-semibold">
            {admin ? "Записи клиента" : "Ваши записи"}
          </h3>
          {!data.bookings.length ? (
            <p className="mt-3 text-base text-neutral-500">Записей пока нет.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {data.bookings.map((slot) => (
                <li key={slot.id} className="rounded-xl bg-brand-50 p-4">
                  <p className="font-medium">{format(slot.starts_at)}</p>
                  <p className="mt-1 text-sm text-neutral-500">
                    60 минут · {timeZone}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
        {!admin && <PackageSupportSection tier={data.client.tier} />}
        {!admin && <p className="mt-5 px-2 text-sm leading-relaxed text-neutral-500">
          Страница и переписка доступны вам по вашему персональному ключу. Пожалуйста, не передавайте ссылку другим людям и сохраните письмо с ключом.
        </p>}
        </div>
      </div>
    </div>
  );
}
