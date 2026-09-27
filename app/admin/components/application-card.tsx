import type { Application } from "../../../lib/admin/applications";
import { answerLabels } from "../../../lib/consultation/answers";

function date(value: Date) {
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(value);
}

export default function ApplicationCard({ application }: { application: Application }) {
  const confirmed = application.status === "confirmed";
  const expired = application.expired;
  return (
    <details className="group rounded-2xl border border-brand-200 bg-white">
      <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-4 p-5">
        <div className="min-w-0">
          <h2 className="break-words font-semibold">{application.answers.name}</h2>
          <p className="mt-1 break-all text-sm text-neutral-600">{application.email}</p>
          <p className="mt-2 text-xs text-neutral-500">Отправлена: {date(application.submitted_at)} UTC</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${confirmed ? "bg-brand-100 text-brand-600" : expired ? "bg-amber-50 text-amber-800" : "bg-neutral-100 text-neutral-600"}`}>
            {confirmed ? "Подтверждена" : expired ? "Истекла · ожидает удаления" : "Ожидает подтверждения"}
          </span>
          <span aria-hidden="true" className="text-brand-500 group-open:rotate-180">⌄</span>
        </div>
      </summary>
      <div className="border-t border-brand-100 p-5">
        <p className="mb-5 text-sm text-neutral-500">
          {application.confirmed_at ? `Подтверждена: ${date(application.confirmed_at)} UTC` : `Срок подтверждения: ${date(application.expires_at!)} UTC`}
          {confirmed && <span className="mt-1 block">Письмо команде: {application.notification_sent_at ? "отправлено" : "ещё не отправлено"}</span>}
        </p>
        <dl className="grid gap-4 sm:grid-cols-2">
          {Object.entries(answerLabels).map(([key, label]) => (
            <div key={key} className={key === "goals" || key === "subject" ? "sm:col-span-2" : ""}>
              <dt className="text-xs text-neutral-500">{label}</dt>
              <dd className="mt-1 whitespace-pre-wrap break-words text-sm">{application.answers[key as keyof typeof application.answers] || "Не указано"}</dd>
            </div>
          ))}
        </dl>
      </div>
    </details>
  );
}
