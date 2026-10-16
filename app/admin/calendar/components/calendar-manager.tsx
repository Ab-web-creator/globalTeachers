"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { AppointmentSlot } from "../../../../lib/client-area/types";
import { appointmentTimeZone } from "../../../../lib/client-area/booking-rules";
import {
  calendarDay,
  calendarHourStart,
} from "../../../../lib/client-area/calendar-hours";

const buttonClass =
  "min-h-12 w-fit rounded-xl bg-brand-500 px-6 py-3 text-base font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500";
const presets = [
  { label: "Утро · 9–12", from: 9, to: 12 },
  { label: "День · 12–15", from: 12, to: 15 },
  { label: "Вечер · 15–18", from: 15, to: 18 },
  { label: "Рабочий день · 9–18", from: 9, to: 18 },
];

export default function CalendarManager({
  slots,
}: {
  slots: AppointmentSlot[];
}) {
  const router = useRouter();
  const [day, setDay] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [now, setNow] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const initial = window.setTimeout(() => {
      const time = Date.now();
      setNow(time);
      setDay(calendarDay(new Date(time)));
    }, 0);
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, []);

  const hours = Array.from({ length: 24 }, (_, hour) => {
    const startsAt = calendarHourStart(day, hour);
    const start = startsAt ? Date.parse(startsAt) : 0;
    const conflicts = slots.filter(
      (slot) =>
        start < Date.parse(slot.ends_at) &&
        start + 3600000 > Date.parse(slot.starts_at),
    );
    const booked = conflicts.some((slot) => slot.booked_by);
    const opened = conflicts.some((slot) => slot.open);
    const overlapping = conflicts.some(
      (slot) =>
        (slot.open || slot.booked_by) && Date.parse(slot.starts_at) !== start,
    );
    const unavailable =
      !start || start <= now || booked || opened || overlapping;
    return {
      hour,
      startsAt,
      unavailable,
      status:
        booked
          ? "Занят"
          : !start || start <= now
            ? "Прошёл"
            : opened
              ? "Открыт"
              : overlapping
                ? "Недоступен"
                : "",
    };
  });
  const selectedAvailable = hours.filter(
    (hour) => selected.includes(hour.hour) && !hour.unavailable,
  );
  const today = now ? calendarDay(new Date(now)) : undefined;
  const daySlots = slots.filter(
    (slot) => calendarDay(new Date(slot.starts_at)) === day,
  );

  async function run(body: object, opening = false) {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Не удалось сохранить изменения.");
      if (opening) {
        setSelected([]);
        setNotice(
          `Открыто часов: ${result.ids.length}. Клиенты могут выбрать их для записи.`,
        );
      } else setNotice("Час закрыт для записи.");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Не удалось сохранить изменения.",
      );
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  function openHours(event: FormEvent) {
    event.preventDefault();
    if (!selectedAvailable.length) {
      setError("Выберите дату и хотя бы один свободный час в будущем.");
      return;
    }
    void run(
      {
        action: "open-slots",
        startsAts: selectedAvailable.map((hour) => hour.startsAt),
      },
      true,
    );
  }

  return (
    <section
      aria-labelledby="admin-calendar-title"
      className="mt-10 rounded-3xl border border-brand-100 bg-white p-5 sm:p-8"
    >
      <h2 id="admin-calendar-title" className="text-2xl font-semibold">
        Календарь консультаций
      </h2>
      <p className="mt-7 max-w-3xl text-base leading-relaxed text-neutral-600">
        Выберите день, отметьте нужные часы и откройте их одной кнопкой. Каждый
        выбранный час — отдельная встреча. Всё остальное время недоступно для
        записи.
      </p>
      <p className="mt-3 text-sm text-neutral-500">
        Часовой пояс календаря: {appointmentTimeZone}.
      </p>
      <div className="mt-10 grid items-start gap-8 lg:grid-cols-2">
        <form onSubmit={openHours}>
          <label htmlFor="slot-day" className="block text-sm font-medium">
            Дата
          </label>
          <input
            id="slot-day"
            type="date"
            required
            min={today}
            value={day}
            onChange={(event) => {
              setDay(event.target.value);
              setSelected([]);
              setError("");
              setNotice("");
            }}
            onInvalid={(event) => {
              event.preventDefault();
              setError("Выберите сегодняшний день или дату в будущем.");
            }}
            aria-describedby={error ? "calendar-error" : undefined}
            className="mt-2 w-full rounded-xl border border-brand-200 px-4 py-3 text-base focus:outline-2 focus:-outline-offset-2 focus:outline-brand-500"
          />
          <fieldset disabled={busy || !day} className="mt-6">
            <legend className="text-base font-semibold">
              Какие часы открыть?
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setSelected(
                      hours
                        .filter(
                          (hour) =>
                            hour.hour >= preset.from &&
                            hour.hour < preset.to &&
                            !hour.unavailable,
                        )
                        .map((hour) => hour.hour),
                    );
                    setError("");
                  }}
                  className="rounded-full border border-brand-200 px-3 py-2 text-sm text-brand-600 hover:bg-brand-50 disabled:opacity-50"
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-6">
              {hours.map((item) => (
                <button
                  key={item.hour}
                  type="button"
                  aria-pressed={
                    selected.includes(item.hour) && !item.unavailable
                  }
                  disabled={item.unavailable || busy}
                  onClick={() => {
                    setSelected((current) =>
                      current.includes(item.hour)
                        ? current.filter((hour) => hour !== item.hour)
                        : [...current, item.hour],
                    );
                    setError("");
                  }}
                  className={`flex min-h-16 flex-col items-center justify-center rounded-xl border px-2 py-2 text-base font-medium focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed ${item.status === "Занят" ? "border-amber-500 bg-amber-50 text-amber-800 disabled:border-amber-500 disabled:bg-amber-50 disabled:text-amber-800" : item.status === "Открыт" ? "border-green-500 bg-green-50 text-green-800 disabled:border-green-500 disabled:bg-green-50 disabled:text-green-800" : item.unavailable ? "border-neutral-100 bg-neutral-50 text-neutral-400" : selected.includes(item.hour) ? "border-brand-500 bg-brand-500 text-white" : "border-brand-200 bg-white text-brand-700 enabled:hover:bg-brand-50"}`}
                >
                  <span>
                    {String(item.hour).padStart(2, "0")}–
                    {String(item.hour + 1).padStart(2, "0")}
                  </span>
                  {item.status && (
                    <span className="mt-1 text-xs font-normal">
                      {item.status}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p aria-live="polite" className="text-sm text-neutral-500">
              Выбрано часов: {selectedAvailable.length}
            </p>
            {selected.length > 0 && (
              <button
                type="button"
                disabled={busy}
                onClick={() => setSelected([])}
                className="text-sm text-brand-600 underline underline-offset-4"
              >
                Снять выбор
              </button>
            )}
          </div>
          {error && (
            <p
              id="calendar-error"
              role="alert"
              className="mt-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          {notice && (
            <p role="status" className="mt-3 text-sm text-brand-600">
              {notice}
            </p>
          )}
          <button
            type="submit"
            disabled={busy || !selectedAvailable.length}
            className={`${buttonClass} mt-5`}
          >
            {busy
              ? "Сохраняем…"
              : `Открыть выбранные часы (${selectedAvailable.length})`}
          </button>
        </form>
        <div>
          <h3 className="text-xl font-semibold">
            Расписание на выбранный день
          </h3>
          <p className="mt-3 text-sm text-neutral-500">
            Забронированные встречи нельзя закрыть. Свободный открытый час можно
            закрыть и затем снова выбрать в сетке.
          </p>
          <ul className="mt-5 max-h-96 space-y-3 overflow-y-auto overscroll-contain">
            {daySlots.map((slot) => (
              <li
                key={slot.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-100 p-4"
              >
                <div>
                  <p className="font-semibold">
                    {new Intl.DateTimeFormat("en-GB", {
                      timeZone: appointmentTimeZone,
                      hour: "2-digit",
                      hourCycle: "h23",
                    }).format(new Date(slot.starts_at))}
                    –
                    {new Intl.DateTimeFormat("en-GB", {
                      timeZone: appointmentTimeZone,
                      hour: "2-digit",
                      hourCycle: "h23",
                    }).format(new Date(slot.ends_at))}
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    {slot.booked_by
                      ? `Забронировано: ${slot.client_name ?? "клиент"}`
                      : slot.open
                        ? "Открыт для записи"
                        : "Закрыт"}
                  </p>
                </div>
                {!slot.booked_by && slot.open && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      void run({ action: "close-slot", id: slot.id });
                    }}
                    className="rounded-lg border border-brand-200 px-3 py-2 text-sm hover:bg-brand-50"
                  >
                    Закрыть час
                  </button>
                )}
              </li>
            ))}
            {!daySlots.length && (
              <li className="rounded-xl bg-brand-50 p-4 text-base text-neutral-500">
                На этот день часы ещё не открыты.
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
