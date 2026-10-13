import { adminTimeZoneCookie, validTimeZone } from "../../../../lib/admin/timezone";
import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionCookie, validSession } from "../../../../lib/admin/session";
import { addressOf, openMessage, unreadCount, type MailMessage } from "../../../../lib/mailbox/messages";
import ComposeForm from "../components/compose-form";
import MailShell from "../components/mail-shell";

export const metadata: Metadata = { title: "Новое письмо — TeacherNavigator", robots: { index: false, follow: false }, referrer: "same-origin" };
export const dynamic = "force-dynamic";

function replyDetails(message: MailMessage, timeZone: string) {
  const to = message.direction === "inbound" ? (message.reply_to.length ? message.reply_to : [message.from_address]).map(addressOf).join(", ") : message.to_addresses.join(", ");
  const subject = /^re:/i.test(message.subject) ? message.subject : `Re: ${message.subject}`;
  const sent = new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short", timeZone }).format(new Date(message.created_at));
  const quoted = (message.text_body ?? "").trim().split("\n").map((line) => `> ${line}`).join("\n");
  return { to, subject, quote: quoted ? `\n\n${sent} (${timeZone}), ${message.from_address}:\n${quoted}` : "" };
}

export default async function NewMailPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const developmentAccess = process.env.NODE_ENV === "development";
  if (!developmentAccess && !validSession((await cookies()).get(sessionCookie)?.value)) redirect("/admin");
  const params = await searchParams;
  const original = typeof params.reply === "string" ? await openMessage(params.reply) : null;
  const timeZone = validTimeZone((await cookies()).get(adminTimeZoneCookie)?.value);
  const reply = original ? replyDetails(original, timeZone) : null;
  const to = typeof params.to === "string" ? params.to.slice(0, 500) : "";
  const mailbox = addressOf(process.env.CONSULTATION_EMAIL_FROM ?? "");
  const unread = await unreadCount().catch(() => 0);
  return (
    <MailShell active={original ? null : "new"} unread={unread} mailbox={mailbox} showLogout={!developmentAccess}>
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-brand-100 px-6 py-4">
        <h1 className="text-xl font-semibold">{original ? "Ответ" : "Новое письмо"}</h1>
        {original && <Link href={`/admin/mail/${original.id}`} className="text-sm text-brand-600">← К письму</Link>}
      </header>
      <ComposeForm key={original?.id ?? "new"} to={reply?.to ?? to} subject={reply?.subject ?? (typeof params.subject === "string" ? params.subject.slice(0,300) : "")} text={!original && typeof params.text === "string" ? params.text.slice(0,50000) : ""} quote={reply?.quote} replyTo={original?.id} mailbox={mailbox} />
    </MailShell>
  );
}
