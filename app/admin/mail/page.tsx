import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionCookie, validSession } from "../../../lib/admin/session";
import { addressOf, listMessages } from "../../../lib/mailbox/messages";
import MailInboxSection from "./components/mail-inbox-section";
import MailShell from "./components/mail-shell";

export const metadata: Metadata = { title: "Почта — TeacherNavigator", robots: { index: false, follow: false }, referrer: "same-origin" };
export const dynamic = "force-dynamic";

export default async function MailPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const developmentAccess = process.env.NODE_ENV === "development";
  if (!developmentAccess && !validSession((await cookies()).get(sessionCookie)?.value)) redirect("/admin");
  const params = await searchParams;
  const folder = params.folder === "frozen" ? "frozen" : params.folder === "candidates" ? "candidates" : params.folder === "vip-clients" ? "vip-clients" : params.folder === "pro-clients" ? "pro-clients" : params.folder === "sent" ? "sent" : params.folder === "start-clients" ? "start-clients" : params.folder === "spam" ? "spam" : "inbox";
  const page = typeof params.page === "string" ? Number(params.page) : 1;
  const data = await listMessages(folder, page).catch(() => null);
  return (
    <MailShell active={folder} unread={data?.unread ?? 0} mailbox={addressOf(process.env.CONSULTATION_EMAIL_FROM ?? "")} showLogout={!developmentAccess}>
      <MailInboxSection folder={folder} data={data} requestedMessage={typeof params.message === "string" ? params.message : undefined} />
    </MailShell>
  );
}
