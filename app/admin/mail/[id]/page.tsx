import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { sessionCookie, validSession } from "../../../../lib/admin/session";
import { addressOf, openMessage, unreadCount, type MailMessage } from "../../../../lib/mailbox/messages";
import AdminNav from "../../components/admin-nav";
import ComposeForm from "../components/compose-form";
import MessageView from "../components/message-view";

export const metadata: Metadata = { title: "Письмо — TeacherNavigator", robots: { index: false, follow: false }, referrer: "same-origin" };
export const dynamic = "force-dynamic";

function replyDetails(message: MailMessage) {
  const to = message.direction === "inbound" ? (message.reply_to.length ? message.reply_to : [message.from_address]).map(addressOf).join(", ") : message.to_addresses.join(", ");
  const subject = /^re:/i.test(message.subject) ? message.subject : `Re: ${message.subject}`;
  const sent = new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(message.created_at);
  const quoted = (message.text_body ?? "").trim().split("\n").map((line) => `> ${line}`).join("\n");
  return { to, subject, quote: quoted ? `\n\n${sent} UTC, ${message.from_address}:\n${quoted}` : "" };
}

export default async function MailMessagePage({ params }: { params: Promise<{ id: string }> }) {
  const developmentAccess = process.env.NODE_ENV === "development";
  if (!developmentAccess && !validSession((await cookies()).get(sessionCookie)?.value)) redirect("/admin");
  const { id } = await params;
  const message = await openMessage(id);
  if (!message) notFound();
  const unread = await unreadCount().catch(() => 0);
  const reply = replyDetails(message);
  return (
    <main className="min-h-dvh bg-brand-50 px-6 py-8 text-brand-700 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <AdminNav active="mail" unread={unread} showLogout={!developmentAccess} />
        <MessageView message={message} />
        <section aria-labelledby="reply-title" className="mt-10">
          <h2 id="reply-title" className="text-xl font-semibold">Ответить</h2>
          <ComposeForm to={reply.to} subject={reply.subject} quote={reply.quote} replyTo={message.id} mailbox={addressOf(process.env.CONSULTATION_EMAIL_FROM ?? "")} />
        </section>
      </div>
    </main>
  );
}
