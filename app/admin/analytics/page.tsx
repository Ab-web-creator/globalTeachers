import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  adminConfigured,
  sessionCookie,
  validSession,
} from "../../../lib/admin/session";
import { analyticsRange } from "../../../lib/analytics/validation";
import { visitAnalytics } from "../../../lib/analytics/visits";
import { geoDatabaseAvailable } from "../../../lib/analytics/location";
import {
  adminTimeZoneCookie,
  validTimeZone,
} from "../../../lib/admin/timezone";
import { unreadCount } from "../../../lib/mailbox/messages";
import AdminNav from "../components/admin-nav";
import AdminLogin from "../components/admin-login";
import AnalyticsSection from "../components/analytics-section";

export const metadata: Metadata = {
  title: "Посещаемость — TeacherNavigator",
  robots: { index: false, follow: false },
  referrer: "same-origin",
};
export const dynamic = "force-dynamic";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const developmentAccess = process.env.NODE_ENV === "development";
  const cookieStore = await cookies();
  const authenticated =
    developmentAccess || validSession(cookieStore.get(sessionCookie)?.value);
  const timeZone = validTimeZone(cookieStore.get(adminTimeZoneCookie)?.value);
  const range = analyticsRange(params, new Date(), timeZone);
  const data = authenticated
    ? await visitAnalytics(range).catch(() => null)
    : null;
  const unread = authenticated ? await unreadCount().catch(() => 0) : 0;
  const geoAvailable = authenticated && (await geoDatabaseAvailable());
  return (
    <div className="min-h-dvh bg-brand-50 text-lg text-brand-700">
      <AdminNav
        active="analytics"
        unread={unread}
        showLogout={authenticated && !developmentAccess}
        showTabs={authenticated}
      />
      <main className="mx-auto w-full max-w-400 px-5 py-8 sm:px-10 sm:py-10 lg:px-16 xl:px-20">
        {authenticated ? (
          <AnalyticsSection
            key={`${range.from}-${range.to}-${range.group}-${range.timeZone}`}
            range={range}
            data={data}
            geoAvailable={geoAvailable}
          />
        ) : (
          <AdminLogin
            configured={adminConfigured()}
            failed={false}
            next="/admin/analytics"
          />
        )}
      </main>
    </div>
  );
}
