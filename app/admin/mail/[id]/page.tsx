import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { sessionCookie, validSession } from "../../../../lib/admin/session";
import { addressOf, openMessage, unreadCount } from "../../../../lib/mailbox/messages";
import MailShell from "../components/mail-shell";
import MessageView from "../components/message-view";

export const metadata: Metadata = { title: "Письмо — TeacherNavigator", robots: { index: false, follow: false }, referrer: "same-origin" };
export const dynamic = "force-dynamic";

export default async function MailMessagePage({ params }: { params: Promise<{ id: string }> }) {
  const developmentAccess = process.env.NODE_ENV === "development";
  if (!developmentAccess && !validSession((await cookies()).get(sessionCookie)?.value)) redirect("/admin");
  const { id } = await params;
  const message = await openMessage(id);
  if (!message) notFound();
  const unread = await unreadCount().catch(() => 0);
  return (
    <MailShell active={message.direction === "inbound" ? "inbox" : "sent"} unread={unread} mailbox={addressOf(process.env.CONSULTATION_EMAIL_FROM ?? "")} showLogout={!developmentAccess}>
      <MessageView message={message} />
    </MailShell>
  );
}
