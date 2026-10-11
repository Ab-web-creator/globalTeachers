import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { sessionCookie, validSession } from "../../../../lib/admin/session";
import { getApplication } from "../../../../lib/admin/applications";
import ApplicationProfile from "../../components/application-profile";

export const metadata: Metadata = { title: "История заявок — TeacherNavigator", robots: { index: false, follow: false }, referrer: "same-origin" };
export const dynamic = "force-dynamic";

export default async function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const authenticated = process.env.NODE_ENV === "development" || validSession((await cookies()).get(sessionCookie)?.value);
  if (!authenticated) redirect("/admin");
  const { id } = await params;
  const application = await getApplication(id);
  if (!application) notFound();
  return <ApplicationProfile application={application} />;
}
