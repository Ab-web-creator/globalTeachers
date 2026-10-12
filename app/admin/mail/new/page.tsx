import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionCookie, validSession } from "../../../../lib/admin/session";
import { addressOf, unreadCount } from "../../../../lib/mailbox/messages";
import AdminNav from "../../components/admin-nav";
import ComposeForm from "../components/compose-form";

export const metadata: Metadata = { title: "Новое письмо — TeacherNavigator", robots: { index: false, follow: false }, referrer: "same-origin" };
export const dynamic = "force-dynamic";

export default async function NewMailPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const developmentAccess = process.env.NODE_ENV === "development";
  if (!developmentAccess && !validSession((await cookies()).get(sessionCookie)?.value)) redirect("/admin");
  const params = await searchParams;
  const to = typeof params.to === "string" ? params.to.slice(0, 500) : "";
  const mailbox = addressOf(process.env.CONSULTATION_EMAIL_FROM ?? "");
  const unread = await unreadCount().catch(() => 0);
  return (
    <main className="min-h-dvh bg-brand-50 px-6 py-8 text-brand-700 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <AdminNav active="mail" unread={unread} showLogout={!developmentAccess} />
        <Link href="/admin/mail" className="mt-6 inline-block text-sm text-brand-600">← Почта</Link>
        <h1 className="mt-4 text-3xl font-semibold">Новое письмо</h1>
        <p className="mt-2 text-sm text-neutral-500">Письмо будет отправлено от {mailbox || "адреса из CONSULTATION_EMAIL_FROM"}. Ответы придут во «Входящие».</p>
        <ComposeForm to={to} mailbox={mailbox} />
      </div>
    </main>
  );
}
