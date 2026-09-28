import type { Application } from "../../../lib/admin/applications";
import ApplicationDetails from "./application-details";
import ApplicationDetailsToggle from "./application-details-toggle";
import DeleteApplicationButton from "./delete-application-button";
import EditApplicationButton from "./edit-application-button";

export default function ApplicationCard({ application }: { application: Application }) {
  const confirmed = application.status === "confirmed";
  const expired = application.expired;
  const submitted = new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(application.submitted_at);

  return (
    <article className="min-w-0 rounded-2xl border border-brand-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      <ApplicationDetailsToggle name={application.answers.name} email={application.email} badge={
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${confirmed ? "bg-brand-50 text-brand-600" : expired ? "bg-neutral-100 text-neutral-600" : "bg-amber-50 text-amber-800"}`}>
            {confirmed ? "Подтверждена" : expired ? "Истекла · ожидает удаления" : "Ожидает подтверждения"}
          </span>
      } actions={<>
        <EditApplicationButton id={application.id} status={application.status} answers={application.answers} />
        <DeleteApplicationButton id={application.id} status={application.status} name={application.answers.name} />
      </>} overview={
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
          <dt className="text-neutral-500">Дата заявки</dt>
          <dd className="text-xs text-neutral-700"><time dateTime={application.submitted_at.toISOString()}>{submitted}</time> UTC</dd>
        </div>
      </dl>
      }>
        <ApplicationDetails application={application} />
      </ApplicationDetailsToggle>
    </article>
  );
}
