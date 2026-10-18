"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { useId, useState } from "react";
import { ConsultationDetailIcon, SubjectPickerChevronIcon, supportCalendarIconPath } from "@/app/components/svg";
import { calendarDay, calendarHourStart } from "../../../lib/client-area/calendar-hours";
import type { AppointmentSlot } from "../../../lib/client-area/types";

type Props = {
  slots: AppointmentSlot[]; bookings: AppointmentSlot[]; timeZone: string; now: number;
  selectedSlot: string; pending: boolean; onSelect: (id: string) => void; onBook: () => void;
};

export default function AppointmentCalendar({ slots, bookings, timeZone, now, selectedSlot, pending, onSelect, onBook }: Props) {
  const t = useTranslations();
  const id = useId();
  const today = calendarDay(new Date(now), timeZone);
  const [day, setDay] = useState(() => {
    const first = [...slots].filter(slot => Date.parse(slot.starts_at) > now).sort((a,b) => Date.parse(a.starts_at)-Date.parse(b.starts_at))[0];
    return first ? calendarDay(new Date(first.starts_at), timeZone) : today;
  });
  const dateLabel = t.formatDate(new Date(`${day}T12:00:00Z`), {
    day: "2-digit", month: "short", year: "numeric", weekday: "short", timeZone: "UTC",
  });
  const clock = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  const hourFormat = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", hourCycle: "h23" });
  const dailySlots = [...slots, ...bookings].filter(slot => calendarDay(new Date(slot.starts_at), timeZone) === day);
  function changeDay(value: string) {
    if (!value || value < today) return;
    setDay(value); onSelect("");
  }
  function moveDay(offset: number) {
    const date = new Date(`${day}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate()+offset);
    changeDay(date.toISOString().slice(0,10));
  }
  const arrowClass = "flex size-10 shrink-0 items-center justify-center rounded-xl border border-brand-200 bg-white text-brand-600 hover:bg-brand-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <form className="mt-6 w-full rounded-2xl border border-brand-200 bg-white/90 p-3" onSubmit={event => { event.preventDefault(); onBook(); }}>
      <fieldset disabled={pending}>
        <legend className="mb-3 text-base font-medium">{t("client.appointmentCalendar.message0003")}</legend>
        <div className="flex items-center gap-1">
          <button type="button" aria-label={t("client.appointmentCalendar.message0004")} disabled={day <= today} onClick={() => moveDay(-1)} className={arrowClass}><SubjectPickerChevronIcon className="size-5 rotate-90" /></button>
          <div className="relative flex h-10 min-w-0 flex-1 items-center rounded-xl border border-brand-200 bg-white pr-8 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-brand-500">
            <span aria-hidden="true" className="pointer-events-none truncate pl-2 text-base">{t.content(dateLabel)}</span>
            <input id={`${id}-date`} aria-label={t.content(`Дата консультации: ${dateLabel}`)} type="date" min={today} value={day} onChange={event => changeDay(event.target.value)} onClick={event => { try { event.currentTarget.showPicker?.(); } catch { event.currentTarget.focus(); } }} className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" />
            <ConsultationDetailIcon path={supportCalendarIconPath} className="pointer-events-none absolute top-1/2 right-2 size-5 -translate-y-1/2" />
          </div>
          <button type="button" aria-label={t("client.appointmentCalendar.message0006")} onClick={() => moveDay(1)} className={arrowClass}><SubjectPickerChevronIcon className="size-5 -rotate-90" /></button>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {Array.from({ length: 24 }, (_, hour) => {
            const matching = dailySlots.filter(slot => Number(hourFormat.format(new Date(slot.starts_at))) === hour);
            // Repeated daylight-saving hours retain each distinct slot.
            return (matching.length ? matching : [null]).map((slot, index) => {
              const booked = Boolean(slot && bookings.some(item => item.id === slot.id));
              const startsAt = slot?.starts_at ?? calendarHourStart(day,hour,timeZone);
              const past = !startsAt || Date.parse(startsAt) <= now;
              const available = Boolean(slot && !booked && !past && slots.some(item => item.id === slot.id));
              const chosen = available && slot?.id === selectedSlot;
              const label = slot ? `${clock.format(new Date(slot.starts_at))}–${clock.format(new Date(slot.ends_at))}`.replaceAll(":00", "") : `${String(hour).padStart(2,"0")}–${String(hour+1).padStart(2,"0")}`;
              return <button key={slot?.id ?? `${hour}-${index}`} type="button" disabled={!available} aria-pressed={chosen} onClick={() => onSelect(chosen ? "" : slot!.id)} className={`flex h-14 min-w-0 flex-col items-center justify-center rounded-lg border px-0 py-1 text-sm font-medium focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed ${booked ? "border-amber-400 bg-amber-50 text-amber-800" : chosen ? "border-brand-500 bg-brand-500 text-white" : available ? "border-green-400 bg-green-50 text-green-800 hover:bg-green-100" : "border-neutral-100 bg-neutral-50 text-neutral-400"}`}>
                <span className="text-xs sm:text-sm">{t.content(label)}</span>
                <span className="mt-1 text-xs font-normal">{t.content(booked ? "Ваша запись" : available ? "Свободно" : past ? "Прошёл" : "Недоступно")}</span>
              </button>;
            });
          })}
        </div>
        <button type="submit" disabled={!slots.some(slot => slot.id === selectedSlot && Date.parse(slot.starts_at) > now)} className="mt-4 min-h-12 rounded-xl bg-brand-500 px-6 py-3 text-base font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">{t.content(pending ? "Бронируем…" : "Забронировать час")}</button>
      </fieldset>
    </form>
  );
}
