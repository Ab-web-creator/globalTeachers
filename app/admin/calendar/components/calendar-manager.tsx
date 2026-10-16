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
          <div className="grid items-start gap-x-15 gap-y-20 xl:grid-cols-[repeat(2,minmax(0,32rem))]">
            {Array.from({ length: 4 + extraDays }, (_, dayOffset) => (
              <div key={dayOffset} className={dayOffset > extraDays ? "hidden xl:block" : undefined}>
                <CalendarDayPicker timeZone={timeZone} slots={slots} dayOffset={dayOffset} />
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setExtraDays(current => current + 4)} className="mt-10 rounded-xl border border-brand-200 bg-white px-6 py-3 text-base font-medium text-brand-600 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500">
            Show 4 more days
          </button>
        </div>
      )}
    </section>
  );
}
