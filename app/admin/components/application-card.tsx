import {
  paymentCandidateTier,
  type Application,
} from "../../../lib/admin/applications";
import Link from "next/link";
import LocalTime from "./local-time";
import { EnvelopeIcon } from "@/app/components/svg";

export default function ApplicationCard({
  application,
}: {
  application: Application;
}) {
  const confirmed = application.status === "confirmed";
  const expired = application.expired;
  const candidateTier = paymentCandidateTier(application.last_step);
  const displayTier = application.paid_at ? application.paid_tier : candidateTier;
  const clientHeaderColors = {
    START: "bg-linear-to-r from-sky-200 to-emerald-200",
    PRO: "bg-linear-to-r from-violet-200 to-pink-200",
    VIP: "bg-linear-to-r from-amber-200 to-rose-200",
  };
  const headerColor = application.paid_at && application.paid_tier
    ? clientHeaderColors[application.paid_tier]
    : "bg-brand-100";

  return (
    <article className="relative flex w-full min-w-0 max-w-64 flex-col rounded-2xl border border-neutral-300 bg-brand-50/40 p-5 pt-3 pb-2 transition hover:border-brand-300 hover:bg-white hover:shadow-sm sm:p-6 sm:pt-3 sm:pb-2">
      <Link
        href={`/admin/applications/${application.attempts[0].id}`}
        className="group block cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
      >
        <div className="relative isolate flex flex-wrap items-center gap-x-2 gap-y-6">
          <span aria-hidden="true" className={`pointer-events-none absolute -top-3 -right-5 -left-5 -z-10 h-12 rounded-t-2xl sm:-right-6 sm:-left-6 ${headerColor}`} />
          <h2 className="min-w-0 break-words text-lg font-semibold leading-tight tracking-tight">
            {application.answers.name || "Без имени"}
          </h2>
          {displayTier && (
            <span className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
              {application.paid_at ? "Клиент" : "Кандидат"} {displayTier}
            </span>
          )}
          {application.status !== "payment" && <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${confirmed ? "bg-brand-50 text-brand-600" : expired ? "bg-neutral-100 text-neutral-600" : "bg-amber-50 text-amber-800"}`}
          >
            {application.status === "not-enough-english"
              ? "Английский не на уровне"
              : application.status === "not-enough-education"
                ? "Образование не то"
                : application.status === "unsupported_subjects"
                  ? "Предметы не те"
                  : confirmed
                    ? "Заявка получена"
                    : application.status === "draft"
                        ? "Незавершённая форма"
                        : expired
                          ? "Срок подтверждения истёк"
                          : "Ожидает подтверждения"}
          </span>}
        </div>
        {application.qualification_changes.length > 0 && (
          <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
            ⚠ Данный юзер изменил свой ответ о педагогической квалификации
          </p>
        )}
        {application.answer_changes.length > 0 && (
          <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
            ⚠ Данный юзер изменил свои ответы о предметах, образовании или
            уровне английского
          </p>
        )}
        {confirmed && application.latest_is_draft && (
          <p className="mt-2 text-xs text-amber-800">
            Последняя форма не завершена
          </p>
        )}
        <div className="mt-5">
          <p className="break-all text-sm text-neutral-700">{application.email}</p>
        <dl className="mt-3 space-y-3 text-sm">
          <div>
            <dt className="text-xs text-neutral-500">Уровень английского</dt>
            <dd className="mt-1 break-words text-neutral-700">
              {application.answers.english === "Уверенный — могу работать на английском" ? "Уверенный" : application.answers.english === "Не говорю по-английски" ? "Не говорю" : application.answers.english || "Не указано"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-500">Образование</dt>
            <dd className="mt-1 break-words text-neutral-700">
              {application.answers.education || "Не указано"}
            </dd>
          </div>
          {application.attempts.length > 1 && (
            <div className="flex items-baseline gap-1 text-neutral-500">
              <dt>Попыток:</dt>
              <dd>{application.attempts.length}</dd>
            </div>
          )}
        </dl>
        </div>
      </Link>
      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
        <span className="text-xs text-neutral-500" title="Дата последней попытки">
          <LocalTime value={application.submitted_at.toISOString()} />
        </span>
        <Link
          href={`/admin/mail/new?${new URLSearchParams({ to: application.email })}`}
          aria-label={`Написать письмо: ${application.email}`}
          title="Написать письмо"
          className="flex size-9 shrink-0 items-center justify-end rounded-xl bg-transparent text-neutral-500 transition hover:text-neutral-700"
        >
          <EnvelopeIcon className="size-4 text-neutral-500" />
        </Link>
      </div>
    </article>
  );
}
