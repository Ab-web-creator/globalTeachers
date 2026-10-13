import Link from "next/link";
import FormSelect from "../../consultation/components/form-select";
import type { analyticsRange } from "../../../lib/analytics/validation";
import type { visitAnalytics } from "../../../lib/analytics/visits";
import AdminStat from "./admin-stat";
import LocalTime from "./local-time";
import { dateInTimeZone } from "../../../lib/admin/timezone";

type Props = {
  range: ReturnType<typeof analyticsRange>;
  data: Awaited<ReturnType<typeof visitAnalytics>> | null;
  geoAvailable: boolean;
};
const number = (value: number) => new Intl.NumberFormat("ru-RU").format(value);
const dateLabel = (value: string, monthly: boolean) =>
  new Intl.DateTimeFormat(
    "ru-RU",
    monthly
      ? { month: "short", year: "numeric", timeZone: "UTC" }
      : { day: "numeric", month: "short", timeZone: "UTC" },
  ).format(new Date(`${value}T00:00:00Z`));
const pageNames: Record<string, string> = {
  "/": "Главная",
  "/consultation": "Анкета",
  "/jobs": "Вакансии",
  "/privacy": "Конфиденциальность",
  "/terms": "Условия",
  "/programs/start": "Программа START",
  "/programs/pro": "Программа PRO",
  "/programs/vip": "Программа VIP",
};

const countryNames = new Intl.DisplayNames(["ru"], { type: "region" });
const countryLabel = (code: string | null) =>
  code ? (countryNames.of(code) ?? code) : "Страна неизвестна";

export default function AnalyticsSection({ range, data, geoAvailable }: Props) {
  const summary = data?.summary;
  const max = Math.max(1, ...(data?.series.map((item) => item.views) ?? []));
  const presets = [7, 30, 90];
  const today = dateInTimeZone(new Date(), range.timeZone);
  return (
    <section>
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-sm font-semibold tracking-widest text-brand-500 uppercase">
            TeacherNavigator / Аналитика
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight">
            Посещаемость сайта
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-neutral-500">
            Все визиты, включая посетителей, которые не оставили заявку.
            Выберите период, чтобы увидеть динамику.
          </p>
        </div>
        <span className="rounded-full border border-brand-200 bg-white px-3 py-1.5 text-sm text-neutral-500">
          Часовой пояс: {range.timeZone}
        </span>
      </header>
      <form
        action="/admin/analytics"
        className="mt-8 flex flex-wrap items-end gap-3 rounded-2xl border border-brand-100 bg-white p-4 sm:p-5"
      >
        <label className="flex-1 text-base font-medium text-neutral-500">
          С даты
          <input
            type="date"
            name="from"
            defaultValue={range.from}
            max={today}
            min="2020-01-01"
            required
            className="mt-2 block w-full min-w-36 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2.5 text-base text-brand-700"
          />
        </label>
        <label className="flex-1 text-base font-medium text-neutral-500">
          По дату включительно
          <input
            type="date"
            name="to"
            defaultValue={range.to}
            max={today}
            min="2020-01-01"
            required
            className="mt-2 block w-full min-w-36 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2.5 text-base text-brand-700"
          />
        </label>
        <label className="flex-1 text-base font-medium text-neutral-500">
          Группировка
          <FormSelect
            name="group"
            defaultValue={range.group}
            className="block w-full min-w-32 rounded-xl border border-brand-200 bg-brand-50 pl-3 py-2.5 text-base text-brand-700"
          >
            <option value="day">По дням</option>
            <option value="month">По месяцам</option>
          </FormSelect>
        </label>
        <button className="rounded-xl bg-brand-500 px-5 py-2.5 text-base font-medium text-white transition hover:bg-brand-600">
          Показать
        </button>
        <div className="flex w-full flex-wrap gap-2 border-t border-brand-100 pt-3">
          {presets.map((days) => {
            const start = new Date(`${today}T00:00:00Z`);
            start.setUTCDate(start.getUTCDate() - days + 1);
            return (
              <Link
                key={days}
                href={`/admin/analytics?${new URLSearchParams({ from: start.toISOString().slice(0, 10), to: today, group: range.group })}`}
                className="rounded-lg px-3 py-1.5 text-base font-medium text-neutral-500 transition hover:bg-brand-50 hover:text-brand-600"
              >
                {days} дней
              </Link>
            );
          })}
          <span className="ml-auto self-center text-base text-neutral-400">
            Период до 366 дней
          </span>
        </div>
      </form>
      {range.invalid && (
        <p role="alert" className="mt-3 text-lg text-amber-800">
          Выберите корректный период до 366 дней без будущих дат. Сейчас
          показаны последние 30 дней.
        </p>
      )}
      {!geoAvailable && (
        <p
          role="status"
          className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-lg text-amber-900"
        >
          База геолокации не установлена. Выполните npm run geoip:update на
          сервере, чтобы определять страны и города новых посетителей.
        </p>
      )}
      {!data ? (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-lg text-amber-900"
        >
          Статистика временно недоступна. Проверьте подключение к базе данных и
          выполните миграции.
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <AdminStat
              label="Визиты"
              value={number(summary!.visits)}
              note="Анонимные сессии за выбранный период"
              featured
            />
            <AdminStat
              label="Просмотры страниц"
              value={number(summary!.views)}
              note="Открытия страниц и переходы по сайту"
            />
            <AdminStat
              label="Страниц за визит"
              value={
                summary!.visits
                  ? (summary!.views / summary!.visits).toFixed(1)
                  : "0"
              }
              note="Среднее число просмотров на сессию"
            />
          </div>
          <section
            aria-labelledby="traffic-chart-title"
            className="mt-6 rounded-3xl border border-brand-100 bg-white p-5 sm:p-7"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 id="traffic-chart-title" className="text-2xl font-semibold leading-tight tracking-tight">
                  Динамика просмотров
                </h2>
                <p className="mt-1 text-lg text-neutral-400">
                  {range.from} — {range.to} ·{" "}
                  {range.group === "month" ? "по месяцам" : "по дням"}
                </p>
              </div>
              <span className="flex items-center gap-2 text-lg text-neutral-500">
                <span className="size-2 rounded-full bg-brand-500" />
                Просмотры страниц
              </span>
            </div>
            {summary!.views === 0 ? (
              <div className="flex h-56 flex-col items-center justify-center text-center">
                <p className="text-lg font-medium text-neutral-600">
                  В этом периоде пока нет посещений
                </p>
                <p className="mt-2 max-w-md text-left text-lg leading-relaxed text-neutral-400">
                  Статистика начнёт появляться после посещения опубликованного
                  сайта. Прошлые визиты восстановить нельзя.
                </p>
              </div>
            ) : (
              <div className="mt-7 overflow-x-auto pb-2">
                <div
                  className="flex h-56 items-end gap-1 border-b border-brand-100"
                  style={{ minWidth: data.series.length * 12 }}
                >
                  {data.series.map((item) => (
                    <div
                      key={item.period}
                      className="group relative flex h-full min-w-2 flex-1 items-end"
                      tabIndex={0}
                      aria-label={`${dateLabel(item.period, range.group === "month")}: ${item.views} просмотров, ${item.visits} визитов`}
                    >
                      <div
                        className={`w-full rounded-t-sm transition group-hover:bg-brand-400 group-focus:bg-brand-400 ${item.views ? "bg-brand-500" : "bg-brand-100"}`}
                        style={{
                          height: item.views
                            ? `${Math.max(1, (item.views / max) * 100)}%`
                            : 2,
                        }}
                      />
                      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-brand-800 px-3 py-2 text-base text-white group-hover:block group-focus:block">
                        {dateLabel(item.period, range.group === "month")} ·{" "}
                        {item.views} просмотров · {item.visits} визитов
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-between text-base text-neutral-400">
                  <span>
                    {dateLabel(data.series[0].period, range.group === "month")}
                  </span>
                  <span>
                    {dateLabel(
                      data.series[data.series.length - 1].period,
                      range.group === "month",
                    )}
                  </span>
                </div>
              </div>
            )}
            <details className="mt-4 border-t border-brand-100 pt-4 text-lg">
              <summary className="cursor-pointer font-medium text-brand-600">
                Показать данные по{" "}
                {range.group === "month" ? "месяцам" : "дням"}
              </summary>
              <div className="mt-4 max-h-80 overflow-auto">
                <table className="w-full text-left text-lg">
                  <thead className="text-lg text-neutral-400">
                    <tr>
                      <th className="py-2 font-medium">Период</th>
                      <th className="py-2 text-right font-medium">Визиты</th>
                      <th className="py-2 text-right font-medium">Просмотры</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.series.map((item) => (
                      <tr
                        key={item.period}
                        className="border-t border-brand-100"
                      >
                        <td className="py-2">
                          {dateLabel(item.period, range.group === "month")}
                        </td>
                        <td className="py-2 text-right tabular-nums">
                          {number(item.visits)}
                        </td>
                        <td className="py-2 text-right tabular-nums">
                          {number(item.views)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </section>
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
            <section className="rounded-3xl border border-brand-100 bg-white p-5 sm:p-7">
              <h2 className="text-lg font-semibold leading-tight tracking-tight">Страны посетителей</h2>
              <p className="mt-1 text-xs text-neutral-400">
                Приблизительное местоположение по IP
              </p>
              <div className="mt-5 max-h-96 overflow-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-neutral-400">
                    <tr>
                      <th className="pb-3 font-medium">Страна</th>
                      <th className="pb-3 text-right font-medium">Визиты</th>
                      <th className="pb-3 pl-4 text-right font-medium">
                        Просмотры
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.countries.map((item) => (
                      <tr
                        key={item.country_code ?? "unknown"}
                        className="border-t border-brand-100"
                      >
                        <td className="py-3 font-medium">
                          {countryLabel(item.country_code)}
                        </td>
                        <td className="py-3 text-right tabular-nums text-neutral-500">
                          {number(item.visits)}
                        </td>
                        <td className="py-3 pl-4 text-right font-semibold tabular-nums">
                          {number(item.views)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!data.countries.length && (
                  <p className="py-8 text-center text-sm text-neutral-400">
                    Нет данных за выбранный период
                  </p>
                )}
              </div>
            </section>
            <section className="rounded-3xl border border-brand-100 bg-white p-5 sm:p-7">
              <h2 className="text-lg font-semibold leading-tight tracking-tight">Города посетителей</h2>
              <p className="mt-1 text-xs text-neutral-400">
                20 самых посещаемых мест · город и страна
              </p>
              <div className="mt-5 max-h-96 overflow-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-neutral-400">
                    <tr>
                      <th className="pb-3 font-medium">Город / страна</th>
                      <th className="pb-3 text-right font-medium">Визиты</th>
                      <th className="pb-3 pl-4 text-right font-medium">
                        Просмотры
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.cities.map((item) => (
                      <tr
                        key={`${item.country_code}-${item.city}`}
                        className="border-t border-brand-100"
                      >
                        <td className="py-3">
                          <p className="font-medium">
                            {item.city ?? "Город неизвестен"}
                          </p>
                          <p className="mt-1 text-xs text-neutral-400">
                            {countryLabel(item.country_code)}
                          </p>
                        </td>
                        <td className="py-3 text-right tabular-nums text-neutral-500">
                          {number(item.visits)}
                        </td>
                        <td className="py-3 pl-4 text-right font-semibold tabular-nums">
                          {number(item.views)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!data.cities.length && (
                  <p className="py-8 text-center text-sm text-neutral-400">
                    Нет данных за выбранный период
                  </p>
                )}
              </div>
            </section>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Геолокация приблизительная: VPN, прокси и мобильные сети могут
            показывать другой город или страну. Один визит может учитываться в
            нескольких местах при смене сети. Местоположение прошлых просмотров
            без геоданных восстановить нельзя.
          </p>
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
            <section className="rounded-3xl border border-brand-100 bg-white p-5 sm:p-7">
              <h2 className="text-lg font-semibold leading-tight tracking-tight">Популярные страницы</h2>
              <p className="mt-1 text-xs text-neutral-400">
                Где посетители проводят время
              </p>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-neutral-400">
                    <tr>
                      <th className="pb-3 font-medium">Страница</th>
                      <th className="pb-3 text-right font-medium">Визиты</th>
                      <th className="pb-3 pl-4 text-right font-medium">
                        Просмотры
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.pages.map((item) => (
                      <tr key={item.path} className="border-t border-brand-100">
                        <td className="py-3">
                          <Link
                            href={item.path}
                            className="font-medium hover:text-brand-500"
                          >
                            {pageNames[item.path] ?? item.path}
                          </Link>
                        </td>
                        <td className="py-3 text-right tabular-nums text-neutral-500">
                          {number(item.visits)}
                        </td>
                        <td className="py-3 pl-4 text-right font-semibold tabular-nums">
                          {number(item.views)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!data.pages.length && (
                  <p className="py-8 text-center text-sm text-neutral-400">
                    Нет данных за выбранный период
                  </p>
                )}
              </div>
            </section>
            <section className="rounded-3xl border border-brand-100 bg-white p-5 sm:p-7">
              <h2 className="text-lg font-semibold leading-tight tracking-tight">Последние просмотры</h2>
              <p className="mt-1 text-xs text-neutral-400">
                Последние 12 событий выбранного периода · {range.timeZone}
              </p>
              <ul className="mt-5 divide-y divide-brand-100">
                {data.recent.map((item, index) => (
                  <li
                    key={index}
                    className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        {pageNames[item.path] ?? item.path}
                      </p>
                      <p className="mt-1 text-xs text-neutral-400">
                        {item.city ?? "Город неизвестен"} ·{" "}
                        {countryLabel(item.country_code)}
                      </p>
                    </div>
                    <LocalTime
                      value={item.occurred_at.toISOString()}
                      className="text-xs tabular-nums text-neutral-400"
                      seconds
                    />
                  </li>
                ))}
              </ul>
              {!data.recent.length && (
                <p className="py-8 text-center text-sm text-neutral-400">
                  Событий пока нет
                </p>
              )}
            </section>
          </div>
        </>
      )}
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-neutral-400">
        Визит — сессия одной вкладки, которая обновляется после 30 минут без
        переходов. Это не число уникальных людей. Сессия, попавшая в несколько
        дней или месяцев, учитывается в каждом из них, но один раз в итоговом
        числе визитов. Данные собираются только на опубликованном сайте;
        блокировщики, настройки приватности и отключённый JavaScript могут
        снижать показатели. Имена, email, IP-адреса и ответы анкеты здесь не
        сохраняются.
      </p>
      <p className="mt-2 text-sm text-neutral-400">
        <a
          href="https://db-ip.com"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4 hover:text-brand-600"
        >
          IP Geolocation by DB-IP
        </a>
      </p>
    </section>
  );
}
