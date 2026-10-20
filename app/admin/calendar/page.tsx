import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionCookie, validSession } from "../../../lib/admin/session";
import { adminCalendar } from "../../../lib/client-area/workspace";
import AdminNav from "../components/admin-nav";
import CalendarManager from "./components/calendar-manager";

export const metadata: Metadata = {
  title: "Календарь — TeacherNavigator",
  robots: { index: false, follow: false },
  referrer: "same-origin",
};
export const dynamic = "force-dynamic";

export default async function AdminCalendarPage() {
  const development = process.env.NODE_ENV === "development";
  if (!development && !validSession((await cookies()).get(sessionCookie)?.value))
    redirect("/admin");
  const calendar = await adminCalendar().catch(() => null);
  return (
    <div className="min-h-dvh bg-white text-brand-700">
      <AdminNav active="calendar" showLogout={!development} />
      <main className="mx-auto w-full max-w-400 px-5 py-8 sm:px-10 lg:px-16 xl:px-20">
        {calendar ? (
          <CalendarManager slots={JSON.parse(JSON.stringify(calendar.slots))} />
        ) : (
          <p role="alert" className="mt-7 text-base text-red-700">
            Не удалось загрузить календарь. Проверьте базу и выполните npm run db:migrate.
          </p>
        )}
      </main>
    </div>
  );
}
