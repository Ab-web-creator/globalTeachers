import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getMessage } from "../../../../../lib/mailbox/messages";
import { validMailViewKey } from "../../../../../lib/mailbox/view-link";
import AdminNav from "../../../components/admin-nav";
import MessageView from "../../components/message-view";

// The key is in the URL, so never pass it on to links opened from the email.
export const metadata: Metadata = { title: "Письмо — TeacherNavigator", robots: { index: false, follow: false }, referrer: "no-referrer" };
export const dynamic = "force-dynamic";

/** Read-only view of one email, opened from its Gmail copy without the admin password. */
export default async function MailViewPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { id } = await params;
  const { key } = await searchParams;
  if (!validMailViewKey(id, key)) redirect(`/admin?${new URLSearchParams({ next: `/admin/mail/${id}` })}`);
  const message = await getMessage(id);
  if (!message) notFound();
  return (
    <div className="flex min-h-dvh flex-col bg-brand-50 text-brand-700 lg:h-dvh">
      <AdminNav showTabs={false} />
      <main className="mx-auto flex min-h-0 w-full max-w-400 flex-1 flex-col px-6 py-6 sm:px-10 lg:px-16 xl:px-20">
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white">
          <MessageView message={message} readOnly />
        </section>
      </main>
    </div>
  );
}
