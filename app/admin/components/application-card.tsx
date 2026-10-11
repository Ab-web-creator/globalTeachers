import type { Application } from "../../../lib/admin/applications";
import Link from "next/link";

export default function ApplicationCard({ application }: { application: Application }) {
  const confirmed = application.status === "confirmed";
  const expired = application.expired;
  const submitted = new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(application.submitted_at);

  return (
    <article className="min-w-0 rounded-2xl border border-brand-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      <Link href={`/admin/applications/${application.attempts[0].id}`} className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="min-w-0 break-words text-base font-semibold">{application.answers.name}</h2>
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
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <dt className="text-neutral-500">Последняя попытка · всего {application.attempts.length}</dt>
            <dd className="text-xs text-neutral-700"><time dateTime={application.submitted_at.toISOString()}>{submitted}</time> UTC</dd>
          </div>
        </dl>
        <span className="mt-4 block text-sm text-brand-600">Открыть историю ответов →</span>
      </Link>
    </article>
  );
}
