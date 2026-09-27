import type { ApplicationFilter } from "../../../lib/admin/applications";

export default function ApplicationFilters({ filter, search }: { filter: ApplicationFilter; search: string }) {
  return (
    <form action="/admin" method="get" className="mt-6 flex flex-wrap items-end gap-3">
      <label className="min-w-0 flex-1 text-sm" htmlFor="application-search">
        Имя или email
        <input
          id="application-search"
          name="q"
          defaultValue={search}
          maxLength={200}
          placeholder="Поиск заявок"
          className="mt-2 block w-full rounded-xl border border-brand-200 bg-white px-4 py-3"
        />
      </label>
      <label className="text-sm" htmlFor="application-status">
        Статус
        <select
          id="application-status"
          name="status"
          defaultValue={filter}
          className="mt-2 block rounded-xl border border-brand-200 bg-white px-4 py-3"
        >
          <option value="all">Все заявки</option>
          <option value="pending">Временные</option>
          <option value="confirmed">Подтверждённые</option>
        </select>
      </label>
      <button className="rounded-xl bg-brand-500 px-5 py-3 text-white hover:bg-brand-600">Показать</button>
    </form>
  );
}
