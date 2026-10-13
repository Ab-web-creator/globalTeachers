import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { sessionCookie, validSession } from "../../../../lib/admin/session";
import { getApplication } from "../../../../lib/admin/applications";
import ApplicationProfile from "../../components/application-profile";
import AdminNav from "../../components/admin-nav";
import { unreadCount } from "../../../../lib/mailbox/messages";

export const metadata: Metadata = { title: "История заявок — TeacherNavigator", robots: { index: false, follow: false }, referrer: "same-origin" };
export const dynamic = "force-dynamic";

export default async function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const developmentAccess = process.env.NODE_ENV === "development";
  const authenticated = developmentAccess || validSession((await cookies()).get(sessionCookie)?.value);
  if (!authenticated) redirect("/admin");
  const { id } = await params;
  const application = await getApplication(id);
  if (!application) notFound();
  const unread = await unreadCount().catch(() => 0);
  return (
    <div className="min-h-dvh bg-brand-50 text-lg text-brand-700">
      <AdminNav active="applications" unread={unread} showLogout={!developmentAccess} />
      <ApplicationProfile application={application} />
    </div>
  );
}
