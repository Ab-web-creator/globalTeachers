import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { adminConfigured, sessionCookie, validSession } from "../../lib/admin/session";
import AdminLogin from "./components/admin-login";
import ApplicationFilters from "./components/application-filters";
import ApplicationsList from "./components/applications-list";
import { listApplications } from "../../lib/admin/applications";

// Native login/logout forms need an Origin header for the server's CSRF check.
export const metadata: Metadata = { title: "Заявки — TeacherNavigator", robots: { index: false, follow: false }, referrer: "same-origin" };
export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const developmentAccess = process.env.NODE_ENV === "development";
  const authenticated = developmentAccess || validSession((await cookies()).get(sessionCookie)?.value);
  const filter = params.status === "draft" || params.status === "pending" || params.status === "confirmed" ? params.status : "all";
  const search = typeof params.q === "string" ? params.q.trim().slice(0, 200) : "";
  const page = typeof params.page === "string" ? Number(params.page) : 1;
  const data = authenticated ? await listApplications(filter, search, page).catch(() => null) : null;
  return (
    <main className="min-h-dvh bg-brand-50 px-6 py-8 text-brand-700 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-sm text-brand-600">← TeacherNavigator</Link>
          {authenticated && !developmentAccess && <form action="/admin/logout" method="post"><button className="rounded-xl border border-brand-200 bg-white px-4 py-2 text-sm">Выйти</button></form>}
        </div>
        {!authenticated ? <AdminLogin configured={adminConfigured()} failed={params.error === "login"} /> : (
          <>
            <aside className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" aria-label="Напоминание о временной задержке писем">
              <p className="font-semibold">Временно: письма по квалификации, образованию, английскому и выбранным предметам отправляются через 4 минуты.</p>
              <p className="mt-1">После тестирования верните задержку на 4 часа. Текущие настройки: миграции 007_temporary_four_minute_followups.sql , 008_subject_followups.sql , 009_education_followups.sql и 010_english_followups.sql.</p>
            </aside>
            <header className="mt-6 grid items-start gap-4 lg:grid-cols-[1fr_auto] lg:gap-x-8">
              <div>
                <h1 className="text-3xl font-semibold">Заявки пользователей</h1>
                <p className="mt-2 text-sm text-neutral-500">
                  {data ? `Незавершённые — ${data.counts.draft}. Email: неподтверждённые — ${data.counts.pending}, подтверждённые — ${data.counts.confirmed}.` : "История заявок по email."} Все даты указаны в UTC.
                </p>
              </div>
              <ApplicationFilters filter={filter} search={search} />
            </header>
            <ApplicationsList filter={filter} search={search} data={data} />
          </>
        )}
      </div>
    </main>
  );
}
