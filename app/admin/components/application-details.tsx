import type { Application } from "../../../lib/admin/applications";
import { answerLabels } from "../../../lib/consultation/answers";

function date(value: Date) {
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(value);
}

export default function ApplicationDetails({ application }: { application: Application }) {
  return (
    <>
      <p className="mb-5 text-xs leading-relaxed text-neutral-500">
        {application.confirmed_at ? `Подтверждена: ${date(application.confirmed_at)} UTC` : application.expires_at ? `Срок подтверждения: ${date(application.expires_at)} UTC` : null}
        {application.status === "confirmed" && <span className="mt-1 block">Письмо команде: {application.notification_sent_at ? "отправлено" : "ещё не отправлено"}</span>}
      </p>
      <dl className="space-y-4">
        {Object.entries(answerLabels).map(([key, label]) => (
          <div key={key}>
            <dt className="text-xs text-neutral-500">{label}</dt>
            <dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed">{application.answers[key as keyof typeof application.answers] || "Не указано"}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
