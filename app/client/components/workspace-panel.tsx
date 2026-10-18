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
  ConsultationCalendarIcon,
  ConsultationBenefitIcon,
  VideoCallIcon,
  MobileMenuCloseIcon,
  supportCalendarIconPath,
} from "@/app/components/svg";
import AppointmentCalendar from "./appointment-calendar";
import AppointmentCall from "./appointment-call";
import ClientWelcomeSection from "./client-welcome-section";
import ConsultationProfileSection from "./consultation-profile-section";
import PrivateChat from "./private-chat";
import ClientFiles from "./client-files";
import PackageSupportSection from "./package-support-section";
import type { ClientWorkspace } from "../../../lib/client-area/types";
import { fullName } from "../../../lib/person-name";

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
  const feedbackDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = feedbackDialog.current;
    if (!dialog) return;
    if (error || notice) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) dialog.close();
  }, [error, notice]);
  function dismissFeedback() {
    setError("");
    setNotice("");
  }

  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [hours, setHours] = useState(String(initial.client.allowance_hours));
  const draftId = useRef("");
  const sending = useRef(false);
  const [timeZone, setTimeZone] = useState("UTC");
  const [now, setNow] = useState(0);
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
    const updateZone = () => {
      setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
      setNow(Date.now());
    };
    const controller = new AbortController();
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setNow(Date.now());
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
    if (sending.current || !message.trim() || (!admin && !data.client.paid_at)) return;
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
    if (sending.current || !selectedSlot || !data.client.paid_at) return;
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

  async function cancelBooking(slotId: string) {
    if (sending.current || !window.confirm("Отменить эту запись? Час вернётся в ваш пакет, и вы сможете выбрать другое время.")) return;
    sending.current = true;
    setPending(true);
    setError("");
    setNotice("");
    try {
      await post("/api/client/bookings", { action: "cancel", slotId });
      setSelectedSlot("");
      setNotice("Запись отменена. Выберите другой свободный час.");
      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось отменить запись.");
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
  const nextBooking = now > 0
    ? [...data.bookings].filter(slot => new Date(slot.ends_at).getTime() > now)
      .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())[0]
    : undefined;
  const displayedBookings = admin && nextBooking
    ? [nextBooking, ...data.bookings.filter(slot => slot.id !== nextBooking.id)]
    : data.bookings;
  const bookingsCard = (
          <div className={admin ? "mt-6 min-w-0 border-t border-neutral-200 pt-4" : "mt-6 w-full min-w-0 rounded-xl bg-linear-to-br from-amber-100 via-orange-50 to-rose-100 p-4 pl-6"}>
          <h3 className="text-lg font-semibold">
            {admin ? "Записи клиента" : data.bookings.length === 1 ? "Ваша запись" : "Ваши записи"}
          </h3>
          {!data.bookings.length ? (
            <p className="mt-3 text-base text-neutral-500">Записей пока нет.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {displayedBookings.map((slot) => (
                <li key={slot.id} className={admin ? slot.id === nextBooking?.id ? "flex items-center gap-4 rounded-xl border border-violet-200 bg-linear-to-r from-violet-50 to-purple-50 p-4" : "border-b border-brand-100 py-2 last:border-0" : undefined}>
                  {admin && slot.id === nextBooking?.id && <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-violet-100 text-brand-500"><ConsultationCalendarIcon clock className="size-9" /></span>}
                  <div className="min-w-0">
                    {admin && slot.id === nextBooking?.id && <p className="mb-1 text-sm font-medium text-brand-600">Ближайшая консультация</p>}
                    <p className="font-semibold">{format(slot.starts_at)}{admin && " · 60 минут"}</p>
                    {!admin && <p className="mt-1 text-sm text-neutral-500">60 минут · {timeZone}</p>}
                  </div>
                  {!admin && data.client.paid_at && new Date(slot.starts_at).getTime() > now && (
                    <button type="button" disabled={pending} onClick={() => void cancelBooking(slot.id)} className="mt-3 rounded-full border border-brand-200 bg-white px-4 py-2 text-sm text-neutral-600 hover:bg-brand-50 disabled:opacity-50">Отменить запись</button>
                  )}
                </li>
              ))}
            </ul>
          )}
          </div>
  );
  return (
    <div>
      <dialog
        ref={feedbackDialog}
        aria-labelledby="workspace-feedback-title"
        aria-describedby="workspace-feedback-message"
        onCancel={event => { event.preventDefault(); dismissFeedback(); }}
        onClick={event => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dismissFeedback();
        }}
        className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border border-brand-100 bg-white p-6 text-brand-950 shadow-xl backdrop:bg-brand-950/30"
      >
        <button type="button" aria-label="Закрыть" onClick={dismissFeedback} className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500"><MobileMenuCloseIcon /></button>
        <h2 id="workspace-feedback-title" className="pr-8 text-xl font-semibold">{error ? "Не удалось выполнить действие" : "Готово"}</h2>
        <p id="workspace-feedback-message" className={`mt-4 text-base leading-relaxed ${error ? "text-red-700" : "text-neutral-600"}`}>{error || notice}</p>
        <button type="button" onClick={dismissFeedback} className="mt-6 rounded-full bg-brand-500 px-6 py-2 text-base font-medium text-white hover:bg-brand-600">Понятно</button>
      </dialog>
      {!admin && !data.client.paid_at && (
        <p role="status" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-base text-amber-900">
          {data.client.frozen_at
            ? "Аккаунт заморожен. Вы можете читать предыдущую переписку и просматривать записи. Отправка новых сообщений и запись на консультации доступны после подтверждения оплаты."
            : "Оплатите пакет, чтобы писать сообщения и записываться на консультации."}
        </p>
      )}
      {!admin && <ClientWelcomeSection name={data.client.name} />}
      <div className={`grid items-start gap-6 ${admin ? "lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]" : "lg:grid-cols-2 lg:items-stretch lg:gap-y-0"}`}>
        <div className={`flex min-w-0 flex-col gap-6 lg:row-start-1 ${admin ? "order-1 lg:col-start-1 lg:sticky lg:top-20" : "order-2 lg:col-start-2 lg:row-span-2"}`}>
          <PrivateChat
            messages={data.messages}
            name={data.client.name}
            admin={admin}
            fillHeight={!admin}
            viewportHeight={admin}
            onClearMessages={admin ? async scope => {
              await post("/api/admin/clients", { action: "clear-chat", clientId: data.client.id, scope });
              setData(current => ({ ...current, messages: scope === "client" ? current.messages.map(item => ({ ...item, hidden_from_client: true })) : [] }));
              await refresh();
            } : undefined}
            onEditMessage={async (id, body) => {
              await post(admin ? "/api/admin/clients" : "/api/client/messages", { action: "edit-chat", ...(admin ? { clientId: data.client.id } : {}), id, body });
              setData(current => ({ ...current, messages: current.messages.map(item => item.id === id ? { ...item, body } : item) }));
              await refresh();
            }}
            onDeleteMessage={async id => {
              await post(admin ? "/api/admin/clients" : "/api/client/messages", { action: "delete-chat", ...(admin ? { clientId: data.client.id } : {}), id });
              setData(current => ({ ...current, messages: current.messages.filter(item => item.id !== id) }));
              await refresh();
            }}
            active={data.client.active && (admin || Boolean(data.client.paid_at))}
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
        <div className={`${admin ? "order-2 flex flex-col gap-6 lg:h-[calc(100dvh-7rem)] lg:gap-4 lg:col-start-2 lg:row-start-1" : "order-1 lg:contents"} min-w-0`}>
        {!admin && <div className="mb-6 lg:col-start-1 lg:row-start-1"><AppointmentCall bookings={data.bookings} /></div>}
        <section
          data-consultations-card
          aria-labelledby="private-calendar-title"
          className={`${admin ? "-mx-5 relative rounded-none border border-t-0 border-neutral-100 pt-10 pb-10 shadow-none before:absolute before:inset-x-0 before:top-0 before:h-2 before:bg-linear-to-r before:from-sky-200 before:via-violet-200 before:to-pink-200 border-b-0 after:absolute after:inset-x-0 after:bottom-0 after:h-2 after:bg-linear-to-r after:from-sky-200 after:via-violet-200 after:to-pink-200 sm:after:hidden sm:border-b sm:mx-0 sm:rounded-3xl sm:border-brand-100 sm:border-t sm:pt-6 sm:pb-6 sm:shadow-sm sm:before:hidden sm:w-full sm:max-w-full lg:shrink-0 lg:col-start-2 lg:row-start-1 lg:self-start" : "w-fit max-w-full rounded-xl border shadow-sm lg:col-start-1 lg:row-start-2"} border-brand-100 bg-white p-5 sm:p-6`}
        >
          <div>
          <div className="min-w-0">
          <div data-consultations-heading className="flex min-h-9 items-center gap-3">
            <span className={`flex shrink-0 items-center justify-center text-brand-500 ${admin ? "size-10" : "size-9 rounded-full bg-brand-50"}`}>
              {admin ? <ConsultationCalendarIcon className="size-9" /> : <ConsultationDetailIcon path={supportCalendarIconPath} className="size-5" />}
            </span>
            <h2
              id="private-calendar-title"
              className={`${admin ? "text-2xl" : "text-xl"} font-semibold text-brand-950`}
            >
              Консультации
            </h2>
          </div>
          {admin ? (
            <div className="mt-7 grid items-end gap-5 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] sm:gap-8">
              <div className="min-w-0">
                <p className="text-sm font-medium text-brand-950">Доступно и забронировано</p>
                <p className="mt-2 text-4xl font-semibold text-brand-950">{data.client.booked_hours} из {data.client.allowance_hours}</p>
                <div role="progressbar" aria-label="Забронировано часов" aria-valuenow={data.client.booked_hours} aria-valuemin={0} aria-valuemax={data.client.allowance_hours} className="mt-4 h-2.5 overflow-hidden rounded-full bg-neutral-200">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${data.client.allowance_hours ? Math.min(100, data.client.booked_hours / data.client.allowance_hours * 100) : 0}%` }} />
                </div>
              </div>
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-violet-100 text-brand-500"><ConsultationBenefitIcon kind="globe" className="size-7" /></span>
                <div className="min-w-0"><p className="break-words text-sm font-medium text-brand-950">{timeZone}</p><p className="mt-1 text-sm text-neutral-500">Часовой пояс</p></div>
              </div>
            </div>
          ) : <p className="mt-7 text-base font-medium leading-relaxed text-neutral-700">
            Пакет {data.client.tier} · Доступно {remaining} из{" "}
            {data.client.allowance_hours} ч. Время указано в часовом поясе {timeZone}.
          </p>}
          {admin && bookingsCard}
          {!admin && data.client.tier === "PRO" && (
            <p className="mt-3 text-sm text-neutral-500">
              Три встречи проходят в разные дни. Не более одного часа в день по
              календарю {data.booking_time_zone}.
            </p>
          )}
          {admin ? (
            data.client.tier === "VIP" ? (
              <form onSubmit={saveHours} className="mt-4 border-t border-brand-100 pt-4">
                <label
                  htmlFor="client-hours"
                  className="block text-sm font-medium"
                >
                  Лимит часов VIP (включая первый час)
                </label>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <div className="w-24 shrink-0">
                <input
                  id="client-hours"
                  type="number"
                  min={0}
                  max={1000}
                  step={1}
                  required
                  value={hours}
                  onChange={(event) => setHours(event.target.value)}
                  className={`${fieldClass} h-12 sm:h-auto`}
                />
                </div>
                <button disabled={pending} className={`${buttonClass} h-12 sm:h-auto`}>
                  Сохранить
                </button>
                </div>
              </form>
            ) : (
              <p className="mt-6 text-pretty text-base text-neutral-500">
                Чтобы перенести или отменить консультацию, согласуйте изменения с клиентом в чате.
              </p>
            )
          ) : (
            <>
              {data.client.paid_at && remaining === 0 && (
                <p className="mt-6 flex items-start gap-2 text-base font-medium leading-relaxed text-neutral-700">
                  <VideoCallIcon className="mt-1 size-5 shrink-0 text-amber-600" />
                  <span>{data.client.tier === "START" && data.bookings.length > 0
                    ? data.bookings.some(slot => new Date(slot.ends_at).getTime() > now)
                      ? data.bookings.some(slot => new Date(slot.starts_at).getTime() <= now && new Date(slot.ends_at).getTime() > now)
                        ? "Ваша консультация сейчас проходит. Дополнительная консультация — $70 за 60 минут. Чтобы записаться, напишите нам в чате."
                        : "Ваш час консультации уже забронирован. Дата и время указаны в блоке «Ваша запись»."
                      : "Вы использовали 1 час консультации, включённый в пакет START. Дополнительная консультация — $70 за 60 минут. Чтобы записаться, напишите нам в чате."
                    : "Сейчас нет доступных часов для записи. Уточните условия у администратора в чате."}</span>
                </p>
              )}
              {data.client.paid_at && remaining > 0 && !data.slots.length && (
                <p className="mt-6 text-base leading-relaxed text-neutral-500">
                  Пока нет свободных часов. Администратор откроет время для
                  записи — уточните удобные даты в чате.
                </p>
              )}

            </>
          )}
          </div>
          </div>
          {!admin && data.client.paid_at && remaining > 0 && now > 0 && (
            <AppointmentCalendar slots={data.slots} bookings={data.bookings} timeZone={timeZone} now={now} selectedSlot={selectedSlot} pending={pending} onSelect={setSelectedSlot} onBook={() => void book()} />
          )}
          {!admin && bookingsCard}
        </section>
        {admin && <ConsultationProfileSection initial={data.profile} admin={admin} onSaved={(profile) => setData(current => ({ ...current, profile, client: { ...current.client, name: fullName(profile) } }))} />}
        {!admin && <div className="lg:col-start-1 lg:row-start-3"><PackageSupportSection tier={data.client.tier} /></div>}

        </div>
      </div>
      {!admin && <ConsultationProfileSection initial={data.profile} admin={admin} onSaved={(profile) => setData(current => ({ ...current, profile, client: { ...current.client, name: fullName(profile) } }))} />}
      <ClientFiles clientId={data.client.id} admin={admin} writable={admin || Boolean(data.client.active && data.client.paid_at)} />
    </div>
  );
}
