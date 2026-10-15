import type { Metadata } from "next";
import { cookies } from "next/headers";
import { adminConfigured, safeAdminPath, sessionCookie, validSession } from "../../lib/admin/session";
import AdminLogin from "./components/admin-login";
import ApplicationsSection from "./components/applications-section";
import { listApplications } from "../../lib/admin/applications";
import { unreadCount } from "../../lib/mailbox/messages";
import AdminNav from "./components/admin-nav";

// Native login/logout forms need an Origin header for the server's CSRF check.
export const metadata: Metadata = { title: "Заявки — TeacherNavigator", robots: { index: false, follow: false }, referrer: "same-origin" };
export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const developmentAccess = process.env.NODE_ENV === "development";
  const authenticated = developmentAccess || validSession((await cookies()).get(sessionCookie)?.value);
  const filter = params.status === "not-enough-english" || params.status === "not-enough-education" || params.status === "unsupported_subjects" || params.status === "draft" || params.status === "pending" || params.status === "confirmed" ? params.status : "all";
  const search = typeof params.q === "string" ? params.q.trim().slice(0, 200) : "";
  const page = typeof params.page === "string" ? Number(params.page) : 1;
  const data = authenticated ? await listApplications(filter, search, page).catch(() => null) : null;
  const unread = authenticated ? await unreadCount().catch(() => 0) : 0;
  return (
    <div className="min-h-dvh bg-brand-50 text-lg text-brand-700">
      <AdminNav active="applications" unread={unread} showLogout={authenticated && !developmentAccess} showTabs={authenticated} />
      <main className="mx-auto w-full max-w-400 px-5 py-8 sm:px-10 sm:py-10 lg:px-16 xl:px-20">
        {!authenticated ? <AdminLogin configured={adminConfigured()} failed={params.error === "login"} next={safeAdminPath(params.next)} /> : (
          <ApplicationsSection data={data} filter={filter} search={search} />
        )}
      </main>
    </div>
  );
}
