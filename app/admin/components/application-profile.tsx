import Link from "next/link";
import { EnvelopeIcon } from "@/app/components/svg";
import type { Application } from "../../../lib/admin/applications";
import ApplicationDetails from "./application-details";
import EditApplicationButton from "./edit-application-button";
import DeleteApplicationButton from "./delete-application-button";
import BackLink from "../../services/components/back-link";
import VideoCallInvitation from "./video-call-invitation";

export default function ApplicationProfile({ application }: { application: Application }) {
  return (
    <main className="mx-auto w-full max-w-400 text-base px-6 sm:px-10 lg:px-16 xl:px-20 py-8">
      <div>
        <div className="flex flex-wrap items-center gap-4">
          <BackLink href="/admin" className="max-md:inline-flex" />
          <Link href={`/admin/mail/new?${new URLSearchParams({ to: application.email })}`} className="group inline-flex w-fit items-center gap-1 rounded-xl bg-white/90 py-1 pr-4 pl-1 text-sm text-neutral-500 shadow-sm">
            <span className="flex size-8 items-center justify-center rounded-full transition-colors duration-200 motion-reduce:transition-none group-hover:bg-neutral-200 group-hover:text-neutral-600">
              <EnvelopeIcon />
            </span>
            Написать письмо
          </Link>
          <VideoCallInvitation applicationId={application.id} />
        </div>
        <section className="mt-6 rounded-3xl border border-brand-100 bg-white p-5 shadow-sm sm:p-8" aria-labelledby="application-profile-title">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 id="application-profile-title" className="break-words text-3xl font-semibold">{application.answers.name}</h1>
              <p className="mt-2 break-all text-sm text-neutral-600">{application.email}</p>
              <p className="mt-3 text-sm text-brand-600">{application.status === "confirmed" ? "Email подтверждён" : application.status === "draft" ? "Незавершённая форма · Email не подтверждён" : "Email ещё не подтверждён"} · Попыток: {application.attempts.length}</p>
              {application.status === "confirmed" && application.latest_is_draft && <p className="mt-2 text-sm text-amber-800">Последняя форма не завершена</p>}
            </div>
            <div className="flex flex-wrap items-start gap-4">
            <div className="flex shrink-0 gap-1">
              {application.editable && <EditApplicationButton id={application.id} status={application.latest_status} answers={application.answers} />}
              <DeleteApplicationButton id={application.id} status={application.latest_status} name={application.answers.name} returnToList />
            </div>
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
