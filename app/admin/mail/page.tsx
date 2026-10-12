import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionCookie, validSession } from "../../../lib/admin/session";
import { addressOf, listMessages } from "../../../lib/mailbox/messages";
import AdminNav from "../components/admin-nav";
import MailList from "./components/mail-list";

export const metadata: Metadata = { title: "Почта — TeacherNavigator", robots: { index: false, follow: false }, referrer: "same-origin" };
export const dynamic = "force-dynamic";

export default async function MailPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const developmentAccess = process.env.NODE_ENV === "development";
  if (!developmentAccess && !validSession((await cookies()).get(sessionCookie)?.value)) redirect("/admin");
  const params = await searchParams;
  const folder = params.folder === "sent" ? "sent" : "inbox";
  const page = typeof params.page === "string" ? Number(params.page) : 1;
  const data = await listMessages(folder, page).catch(() => null);
  const mailbox = addressOf(process.env.CONSULTATION_EMAIL_FROM ?? "");
  return (
    <main className="min-h-dvh bg-brand-50 px-6 py-8 text-brand-700 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <AdminNav active="mail" unread={data?.unread} showLogout={!developmentAccess} />
        <MailList folder={folder} mailbox={mailbox} data={data} />
      </div>
    </main>
  );
}
