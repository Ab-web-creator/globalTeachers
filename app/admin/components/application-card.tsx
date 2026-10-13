import type { Application } from "../../../lib/admin/applications";
import Link from "next/link";
import LocalTime from "./local-time";
import { EnvelopeIcon } from "@/app/components/svg";

export default function ApplicationCard({ application }: { application: Application }) {
  const confirmed = application.status === "confirmed";
  const expired = application.expired;

  return (
    <article className="relative min-w-0 rounded-2xl border border-brand-100 bg-brand-50/40 p-5 transition hover:border-brand-300 hover:bg-white hover:shadow-sm sm:p-6">
      <Link
        href={`/admin/mail/new?${new URLSearchParams({ to: application.email })}`}
        aria-label={`Написать письмо: ${application.email}`}
        title="Написать письмо"
        className="absolute top-4 right-5 z-10 flex size-9 items-center justify-center rounded-xl bg-transparent text-neutral-500 transition hover:text-neutral-700 sm:top-5 sm:right-6"
      >
        <EnvelopeIcon />
      </Link>
      <Link href={`/admin/applications/${application.attempts[0].id}`} className="group block cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500">
        <div className="flex flex-wrap items-center gap-2 pr-12">
          <h2 className="min-w-0 break-words text-lg font-semibold leading-tight tracking-tight">{application.answers.name || "Без имени"}</h2>
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${confirmed ? "bg-brand-50 text-brand-600" : expired ? "bg-neutral-100 text-neutral-600" : "bg-amber-50 text-amber-800"}`}>
            {confirmed ? "Email подтверждён" : application.status === "draft" ? "Незавершённая форма" : expired ? "Срок подтверждения истёк" : "Ожидает подтверждения"}
          </span>
        </div>
        {application.qualification_changes.length > 0 && <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">⚠ Данный юзер изменил свой ответ о педагогической квалификации</p>}
        {application.answer_changes.length > 0 && <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">⚠ Данный юзер изменил свои ответы о предметах, образовании или уровне английского</p>}
        {confirmed && application.latest_is_draft && <p className="mt-2 text-xs text-amber-800">Последняя форма не завершена</p>}
        <p className="mt-1 break-all text-sm text-neutral-700">{application.email}</p>
        <dl className="mt-5 space-y-3 border-t border-brand-100 pt-4 text-sm">
          <div>
            <dt className="text-xs text-neutral-500">Уровень английского</dt>
            <dd className="mt-1 break-words text-neutral-700">{application.answers.english || "Не указано"}</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-500">Образование</dt>
            <dd className="mt-1 break-words text-neutral-700">{application.answers.education || "Не указано"}</dd>
          </div>
          {application.attempts.length > 1 && (
            <div className="flex items-baseline gap-1 text-neutral-500">
              <dt>Попыток:</dt>
              <dd>{application.attempts.length}</dd>
            </div>
          )}
        </dl>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
          <span className="inline-flex items-center justify-center rounded-xl border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-600 transition group-hover:border-brand-500 group-hover:bg-brand-500 group-hover:text-white group-focus-visible:border-brand-500 group-focus-visible:bg-brand-500 group-focus-visible:text-white">Открыть карточку</span>
          <span className="ml-auto text-right text-xs text-neutral-500" title="Дата последней попытки">
            <LocalTime value={application.submitted_at.toISOString()} />
          </span>
        </div>
      </Link>
    </article>
  );
}
