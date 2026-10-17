"use client";

import { useEffect, useId, useState } from "react";
import { SubjectPickerChevronIcon, ConsultationDetailIcon, supportCalendarIconPath } from "@/app/components/svg";
import { useRouter } from "next/navigation";
import type { AppointmentSlot } from "../../../../lib/client-area/types";
import {
  calendarDay,
  calendarHourStart,
} from "../../../../lib/client-area/calendar-hours";

const presets = [
  { label: "До обеда", from: 9, to: 12 },
  { label: "После обеда", from: 12, to: 18 },
  { label: "Вечером", from: 18, to: 21 },
  { label: "Поздно вечером", from: 21, to: 24 },
];

export default function CalendarDayPicker({
  slots, timeZone, dayOffset = 0,
}: {
  slots: AppointmentSlot[]; timeZone: string; dayOffset?: number;
}) {
  const router = useRouter();
  const id = useId();
  const dateId = `${id}-day`;
  const errorId = `${id}-error`;
  const [day, setDay] = useState("");
  const [selectedStarts, setSelectedStarts] = useState<string[]>([]);
  const [now, setNow] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [closedHour, setClosedHour] = useState<number | null>(null);
  useEffect(() => {
    if (closedHour === null) return;
    const timer = window.setTimeout(() => setClosedHour(null), 2000);
    return () => window.clearTimeout(timer);
  }, [closedHour]);
  useEffect(() => {
    const initial = window.setTimeout(() => {
      const time = Date.now();
      setNow(time);
      const date = new Date(`${calendarDay(new Date(time), timeZone)}T12:00:00Z`);
      date.setUTCDate(date.getUTCDate() + dayOffset);
      setDay(date.toISOString().slice(0, 10));
    }, 0);
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, [dayOffset, timeZone]);

  const hours = Array.from({ length: 24 }, (_, hour) => {
    const startsAt = calendarHourStart(day, hour, timeZone);
    const start = startsAt ? Date.parse(startsAt) : 0;
    const conflicts = slots.filter(
      (slot) =>
        start < Date.parse(slot.ends_at) &&
        start + 3600000 > Date.parse(slot.starts_at),
    );
    const bookedSlot = conflicts.find((slot) => slot.booked_by);
    const booked = Boolean(bookedSlot);
    const openSlot = conflicts.find((slot) => slot.open && !slot.booked_by && Date.parse(slot.starts_at) === start);
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
      clientName: bookedSlot?.client_name ?? (booked ? "Клиент" : ""),
      closeSlotId: !booked && !overlapping && start > now ? openSlot?.id : undefined,
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
  const selected = hours.filter(hour => hour.startsAt && selectedStarts.includes(hour.startsAt) && !hour.unavailable).map(hour => hour.hour);
  function setSelected(update: number[] | ((current: number[]) => number[])) {
    const next = typeof update === "function" ? update(selected) : update;
    setSelectedStarts(hours.filter(hour => next.includes(hour.hour) && !hour.unavailable).map(hour => hour.startsAt!));
  }
  const today = now ? calendarDay(new Date(now), timeZone) : undefined;
  const dateParts = day ? new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short", year: "numeric", weekday: "short", timeZone: "UTC" }).formatToParts(new Date(`${day}T12:00:00Z`)) : [];
  const datePart = (type: string) => dateParts.find(part => part.type === type)?.value ?? "";
  const dateLabel = day ? `${datePart("day")} ${datePart("month")} ${datePart("year")}, ${datePart("weekday")}` : "Выберите дату";

  function changeDay(value: string) {
    setClosedHour(null);
    setDay(value);
    setSelectedStarts([]);
    setError("");
  }
  function moveDay(offset: number) {
    if (!day) return;
    const date = new Date(`${day}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + offset);
    const next = date.toISOString().slice(0, 10);
    if (today && next < today) return;
    changeDay(next);
  }



  async function run(body: object, opening = false, hour?: number) {
    if (busy) return;
    setBusy(true);
    setClosedHour(null);
    setError("");
   
    try {
      const response = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Не удалось сохранить изменения.");
      if (opening) setSelectedStarts([]);
      if (!opening && hour !== undefined) setClosedHour(hour);
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

  return (
    <div className="w-full min-w-0">
        <div>
          <fieldset disabled={busy}>
            <legend className="sr-only">
              Какие часы открыть?
            </legend>
            <div className="flex flex-wrap justify-start gap-2 xl:justify-between">
              {presets.map((preset) => {
                const presetHours = hours.filter(hour => hour.hour >= preset.from && hour.hour < preset.to && !hour.unavailable).map(hour => hour.hour);
                const pressed = presetHours.length > 0 && presetHours.every(hour => selected.includes(hour));
                return (
                  <button
                    key={preset.label}
                    type="button"
                    aria-pressed={pressed}
                    disabled={!presetHours.length}
                    onClick={() => {
                      setSelected(current => presetHours.every(hour => current.includes(hour))
                        ? current.filter(hour => !presetHours.includes(hour))
                        : [...new Set([...current, ...presetHours])]);
                      setError("");
                    }}
                    className={`rounded-xl border px-2 py-1.5 text-xs disabled:opacity-50 ${pressed ? "border-brand-500 bg-brand-50 text-brand-700" : "border-brand-200 text-brand-600 hover:bg-brand-50"}`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 rounded-2xl border border-brand-200 bg-neutral-100 p-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-1">
                <button type="button" aria-label="Предыдущий день" disabled={!day || !today || day <= today} onClick={() => moveDay(-1)} className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-brand-200 bg-white text-brand-600 hover:bg-brand-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-40">
                  <SubjectPickerChevronIcon className="size-5 rotate-90" />
                </button>
                <div className="relative flex h-10 min-w-0 flex-1 items-center rounded-xl border border-brand-200 bg-white pr-8 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-brand-500">
          <input
            id={dateId}
            aria-label={`Дата: ${dateLabel}`}
            type="date"
            required
            min={today}
            value={day}
            onChange={(event) => changeDay(event.target.value)}
            onInvalid={(event) => {
              event.preventDefault();
              setError("Выберите сегодняшний день или дату в будущем.");
            }}
            aria-describedby={error ? errorId : undefined}
            onClick={event => {
              try { event.currentTarget.showPicker?.(); } catch { event.currentTarget.focus(); }
            }}
            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"

          />
                  <span aria-hidden="true" className="pointer-events-none truncate pl-2 text-sm text-brand-700">{dateLabel}</span>
                  <ConsultationDetailIcon path={supportCalendarIconPath} className="pointer-events-none absolute top-1/2 right-2 size-5 -translate-y-1/2 text-brand-700" />
                </div>
                <button type="button" aria-label="Следующий день" disabled={!day} onClick={() => moveDay(1)} className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-brand-200 bg-white text-brand-600 hover:bg-brand-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-40">
                  <SubjectPickerChevronIcon className="size-5 -rotate-90" />
                </button>
                </div>
          <button type="button" disabled={busy || !selected.length} onClick={() => void run({ action: "open-slots", startsAts: hours.filter(hour => selected.includes(hour.hour)).map(hour => hour.startsAt), timeZone }, true)} className={`ml-auto min-h-10 shrink-0 rounded-xl border bg-white px-3 py-2 text-sm font-[450] transition-colors hover:bg-brand-50 disabled:cursor-not-allowed ${!hours.some(hour => !hour.unavailable) ? "border-neutral-200 text-neutral-400" : selected.length ? "border-brand-500 text-brand-600" : "border-brand-200 text-brand-700"}`}>
            {busy ? "Сохраняем…" : "Открыть"}
          </button>
              </div>
            <div className="mt-3 grid grid-cols-5 gap-1.5">
              {hours.map((item) => (
                <button
                  key={item.hour}
                  type="button"
                  aria-pressed={item.closeSlotId ? undefined : selected.includes(item.hour) && !item.unavailable}
                  aria-label={item.closeSlotId ? `${String(item.hour).padStart(2, "0")}–${String(item.hour + 1).padStart(2, "0")}: закрыть открытый час` : undefined}
                  disabled={(item.unavailable && !item.closeSlotId) || busy}
                  onClick={() => {
                    if (item.closeSlotId) {
                      void run({ action: "close-slot", id: item.closeSlotId }, false, item.hour);
                      return;
                    }
                    setSelected((current) =>
                      current.includes(item.hour)
                        ? current.filter((hour) => hour !== item.hour)
                        : [...current, item.hour],
                    );
                    setError("");
                  }}
                  className={`relative flex h-12 flex-col items-center justify-center rounded-lg border px-0 py-1 text-xs font-medium focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed ${item.status === "Занят" ? "border-amber-500 bg-amber-50 text-amber-800 disabled:border-amber-500 disabled:bg-amber-50 disabled:text-amber-800" : item.status === "Открыт" ? "border-green-500 bg-green-50 text-green-800 enabled:hover:bg-green-100 disabled:border-green-500 disabled:bg-green-50 disabled:text-green-800" : item.unavailable ? "border-neutral-100 bg-neutral-50 text-neutral-400" : selected.includes(item.hour) ? "border-brand-500 bg-brand-500 text-white" : "border-brand-200 bg-white text-brand-700 enabled:hover:bg-brand-50"}`}
                >
                  {closedHour === item.hour && <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-lg bg-neutral-800 px-3 py-2 text-xs font-normal whitespace-nowrap text-white shadow-lg">Час закрыт для записи.</span>}
                  <span>
                    {String(item.hour).padStart(2, "0")}–
                    {String(item.hour + 1).padStart(2, "0")}
                  </span>
                  {item.status && !item.clientName && (
                    <span className="mt-1 text-xs font-normal">
                      {item.status}
                    </span>
                  )}
                  {item.clientName && <span title={`Забронировано: ${item.clientName}`} className="mt-1 text-xs font-normal">Занят</span>}
                </button>
              ))}
            </div>
            </div>
          </fieldset>
          {error && (
            <p
              id={errorId}
              role="alert"
              className="mt-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

        </div>

    </div>
  );
}
