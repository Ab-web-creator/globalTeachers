import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { adminConfigured, sessionCookie, validSession } from "../../lib/admin/session";
import AdminLogin from "./components/admin-login";
import ApplicationFilters from "./components/application-filters";
import ApplicationsList from "./components/applications-list";

// Native login/logout forms need an Origin header for the server's CSRF check.
export const metadata: Metadata = { title: "Заявки — GlobalTeacherHub", robots: { index: false, follow: false }, referrer: "same-origin" };
export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const authenticated = validSession((await cookies()).get(sessionCookie)?.value);
  const filter = params.status === "pending" || params.status === "confirmed" ? params.status : "all";
  const search = typeof params.q === "string" ? params.q.trim().slice(0, 200) : "";
  const page = typeof params.page === "string" ? Number(params.page) : 1;
  return (
    <main className="min-h-dvh bg-brand-50 px-6 py-8 text-brand-700 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm text-brand-600">← GlobalTeacherHub</Link>
        {!authenticated ? <AdminLogin configured={adminConfigured()} failed={params.error === "login"} /> : (
          <>
            <header className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div><h1 className="text-3xl font-semibold">Заявки пользователей</h1><p className="mt-2 text-sm text-neutral-500">Временные и постоянные записи. Все даты указаны в UTC.</p></div>
              <form action="/admin/logout" method="post"><button className="rounded-xl border border-brand-200 bg-white px-4 py-2 text-sm">Выйти</button></form>
            </header>
            <ApplicationFilters filter={filter} search={search} />
            <ApplicationsList filter={filter} search={search} page={page} />
          </>
        )}
      </div>
    </main>
  );
}
