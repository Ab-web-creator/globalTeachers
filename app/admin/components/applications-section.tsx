import type {
  ApplicationFilter,
  listApplications,
} from "../../../lib/admin/applications";
import ApplicationFilters from "./application-filters";
import ApplicationsList from "./applications-list";

export default function ApplicationsSection({
  data,
  filter,
  search,
}: {
  data: Awaited<ReturnType<typeof listApplications>> | null;
  filter: ApplicationFilter;
  search: string;
}) {
  return (
    <section>
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-sm font-semibold tracking-widest text-brand-500 uppercase">
            TeacherNavigator / Обзор
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight">
            Заявки и обращения
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-neutral-500">
            От первого шага до отправленной заявки. Все обращения и история
            ответов в одном месте.
          </p>
        </div>
      </header>
      <div className="mt-8 rounded-3xl border border-brand-100 bg-white p-5 sm:p-6">
        <div className="grid items-center gap-4 lg:grid-cols-[1fr_auto]">
          <h2 className="text-2xl font-semibold leading-tight tracking-tight">Все обращения</h2>
          <ApplicationFilters filter={filter} search={search} />
        </div>
        <ApplicationsList filter={filter} search={search} data={data} />
      </div>
      <p className="mt-5 text-sm text-neutral-400">
        Даты и время отображаются в часовом поясе вашего браузера.
      </p>
    </section>
  );
}
