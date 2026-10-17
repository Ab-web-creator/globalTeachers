import Link from "next/link";
import type { listApplications, ApplicationFilter } from "../../../lib/admin/applications";
import ApplicationCard from "./application-card";

export default function ApplicationsList({ filter, search, data }: { filter: ApplicationFilter; search: string; data: Awaited<ReturnType<typeof listApplications>> | null }) {
  if (!data) {
    return <p role="alert" className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-lg">Не удалось подключиться к базе данных. Проверьте DATABASE_URL и выполните npm run db:migrate.</p>;
  }
  const url = (next: number) => `/admin?${new URLSearchParams({ status: filter, q: search, page: String(next) })}`;
  return (
    <>
      <p className="mt-6 mb-4 text-sm text-neutral-500">Найдено: {data.total}</p>
      <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
        {data.applications.map((application) => <ApplicationCard key={application.id} application={application} />)}
        {!data.total && <p className="rounded-2xl border border-brand-100 bg-white p-8 text-center text-base text-neutral-500 col-span-full">Заявок пока нет или ничего не найдено по вашему запросу.</p>}
      </div>
      <nav aria-label="Страницы заявок" className="mt-6 flex items-center justify-between gap-4 text-lg">
        {data.page > 1 ? <Link href={url(data.page - 1)} className="text-brand-600">← Назад</Link> : <span />}
        <span className="text-base">Страница {data.page} из {data.pages}</span>
        {data.page < data.pages ? <Link href={url(data.page + 1)} className="text-brand-600">Далее →</Link> : <span />}
      </nav>
    </>
  );
}
