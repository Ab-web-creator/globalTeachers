"use client";

import { useEffect, useState } from "react";
import type { AppointmentSlot } from "../../../../lib/client-area/types";
import { validTimeZone } from "../../../../lib/admin/timezone";
import CalendarDayPicker from "./calendar-day-picker";

export default function CalendarManager({ slots }: { slots: AppointmentSlot[] }) {
  const [extraDays, setExtraDays] = useState(0);
  const [timeZone, setTimeZone] = useState<string | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => setTimeZone(validTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)), 0);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <section aria-labelledby="admin-calendar-title" className="bg-white">
      <h2 id="admin-calendar-title" className="text-3xl font-semibold">
        Календарь консультаций
      </h2>
      <p className="mt-7 max-w-[61ch] text-base leading-relaxed text-neutral-600">
        Выберите день, отметьте нужные часы и откройте их одной кнопкой. Каждый
        выбранный час — отдельная встреча. Всё остальное время недоступно для
        записи.
      </p>
      <p className="mt-3 max-w-[61ch] text-base leading-relaxed text-neutral-600">
        Нажмите на открытый час, чтобы закрыть его. В забронированных часах
        указано имя клиента. Забронированные встречи нельзя закрыть.
      </p>
      {timeZone && (
        <div className="mt-10">
          <div className="grid items-start grid-cols-1 gap-x-14 gap-y-20 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 + extraDays }, (_, dayOffset) => (
              <div key={dayOffset} className={dayOffset > extraDays ? "hidden md:block" : undefined}>
                <CalendarDayPicker timeZone={timeZone} slots={slots} dayOffset={dayOffset} />
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setExtraDays(current => current + 3)} className="mt-10 rounded-full border border-brand-500 bg-white px-6 py-2 text-base font-medium text-brand-600 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500">
            Show 3 more days
          </button>
        </div>
      )}
    </section>
  );
}
