import Link from "next/link";
import type { Application } from "../../../lib/admin/applications";
import ApplicationDetails from "./application-details";
import EditApplicationButton from "./edit-application-button";
import DeleteApplicationButton from "./delete-application-button";

export default function ApplicationProfile({ application }: { application: Application }) {
  return (
    <main className="min-h-dvh bg-brand-50 px-6 py-8 text-brand-700 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm text-brand-600">← Все пользователи</Link>
        <section className="mt-6 rounded-3xl border border-brand-100 bg-white p-5 shadow-sm sm:p-8" aria-labelledby="application-profile-title">
          <header className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 id="application-profile-title" className="break-words text-3xl font-semibold">{application.answers.name}</h1>
              <p className="mt-2 break-all text-sm text-neutral-600">{application.email} · <Link href={`/admin/mail/new?${new URLSearchParams({ to: application.email })}`} className="text-brand-600">Написать</Link></p>
              <p className="mt-3 text-sm text-brand-600">{application.status === "confirmed" ? "Email подтверждён" : application.status === "draft" ? "Незавершённая форма · Email не подтверждён" : "Email ещё не подтверждён"} · Попыток: {application.attempts.length}</p>
              {application.status === "confirmed" && application.latest_is_draft && <p className="mt-2 text-sm text-amber-800">Последняя форма не завершена</p>}
            </div>
            <div className="flex shrink-0 gap-1">
              {application.editable && <EditApplicationButton id={application.id} status={application.latest_status} answers={application.answers} />}
              <DeleteApplicationButton id={application.id} status={application.latest_status} name={application.answers.name} returnToList />
            </div>
          </header>
          <div className="mt-7 border-t border-brand-100 pt-6">
            <ApplicationDetails application={application} />
          </div>
        </section>
      </div>
    </main>
  );
}
