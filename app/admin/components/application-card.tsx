import { paymentCandidateTier, type Application } from "../../../lib/admin/applications";
import Link from "next/link";
import LocalTime from "./local-time";
import DeleteApplicationButton from "./delete-application-button";
import styles from "./application-card.module.css";
import { BriefcaseIcon, StartClientIcon, SupportCrownIcon, EnvelopeIcon, UserProfileIcon, ApplicationEnglishIcon, ApplicationEducationIcon, ApplicationCalendarIcon, ApplicationStarIcon } from "@/app/components/svg";

export default function ApplicationCard({ application }: { application: Application }) {
  const confirmed = application.status === "confirmed";
  const expired = application.expired;
  const paid = Boolean(application.paid_at);
  const displayTier = paid ? application.paid_tier : paymentCandidateTier(application.last_step);
  const clientHeaderColors = {
    START: "bg-linear-to-r from-sky-500 to-emerald-500 text-white",
    PRO: "bg-linear-to-r from-brand-500 to-violet-500 text-white",
    VIP: "bg-linear-to-r from-amber-400 to-orange-400 text-white",
  };
  const headerColor = paid && application.paid_tier
    ? clientHeaderColors[application.paid_tier]
    : "bg-linear-to-r from-neutral-300 to-neutral-200 text-neutral-800";
  const NameIcon = paid
    ? application.paid_tier === "VIP" ? SupportCrownIcon : application.paid_tier === "PRO" ? BriefcaseIcon : StartClientIcon
    : UserProfileIcon;
  const statusLabel = application.status === "not-enough-english" ? "Английский не на уровне"
    : application.status === "not-enough-education" ? "Образование не то"
    : application.status === "unsupported_subjects" ? "Предметы не те"
    : confirmed ? "Заявка получена"
    : application.status === "draft" ? "Незавершённая форма"
    : expired ? "Срок подтверждения истёк" : "Ожидает подтверждения";
  const english = application.answers.english === "Не говорю по-английски"
    ? "Не говорю" : application.answers.english?.split(" — ")[0] || "Не указано";

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-md transition-shadow hover:shadow-lg">
      <Link
        href={`/admin/applications/${application.attempts[0].id}`}
        className="block flex-1 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500"
      >
        <header className={`relative isolate flex flex-col gap-2 overflow-hidden px-4 py-3 ${headerColor}`}>
          <span aria-hidden="true" className={`${styles.ornament} ${paid ? styles.paidOrnament : ""}`} />
          <h2 className="flex min-w-0 items-center gap-2 text-base font-semibold leading-tight">
            <NameIcon className="size-6 shrink-0" />
            <span className="min-w-0 break-words">{application.answers.name || "Без имени"}</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {displayTier && (
              <span className={`inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm ${paid && application.paid_tier === "VIP" ? "text-amber-700" : "text-brand-700"}`}>
                {paid && <ApplicationStarIcon className="size-4 shrink-0" />}
                {paid ? "Клиент" : "Кандидат"} {displayTier}
              </span>
            )}
            {!paid && application.status !== "payment" && (
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${confirmed ? "bg-white text-brand-700" : expired ? "bg-neutral-100 text-neutral-600" : "bg-amber-50 text-amber-800"}`}>
                {statusLabel}
              </span>
            )}
          </div>
        </header>
        <div className="px-4">
          <dl className="divide-y divide-neutral-200 text-sm">
            <div className="flex items-start gap-3 py-2">
              <EnvelopeIcon className="mt-0.5 size-4 shrink-0 text-neutral-600" />
              <div className="min-w-0">
                <dt className="text-xs text-neutral-500">Email</dt>
                <dd className="mt-0.5 break-all text-neutral-800">{application.email}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3 py-2">
              <ApplicationEnglishIcon className="mt-0.5 size-4 shrink-0 text-neutral-600" />
              <div className="min-w-0">
                <dt className="text-xs text-neutral-500">Уровень английского</dt>
                <dd className="mt-0.5 break-words text-neutral-800">{english}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3 py-2">
              <ApplicationEducationIcon className="mt-0.5 size-4 shrink-0 text-neutral-600" />
              <div className="min-w-0">
                <dt className="text-xs text-neutral-500">Образование</dt>
                <dd className="mt-0.5 break-words text-neutral-800">{application.answers.education || "Не указано"}</dd>
              </div>
            </div>
            {application.attempts.length > 1 && (
              <div className="flex gap-2 py-2 text-xs text-neutral-500">
                <dt>Попыток:</dt><dd>{application.attempts.length}</dd>
              </div>
            )}
          </dl>
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
        </div>
      </Link>
      <footer className="mx-4 flex items-start gap-3 border-t border-neutral-200 py-2">
        <ApplicationCalendarIcon className="mt-0.5 size-4 shrink-0 text-neutral-600" />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-neutral-500">Дата последней попытки</p>
          <LocalTime value={application.submitted_at.toISOString()} className="mt-0.5 block text-sm text-neutral-800" />
        </div>
        <div className="flex shrink-0 items-start gap-1">
          <Link
            href={`/admin/mail/new?${new URLSearchParams({ to: application.email })}`}
            aria-label={`Написать письмо: ${application.email}`}
            title="Написать письмо"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-brand-50 hover:text-brand-600 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500"
          >
            <EnvelopeIcon className="size-5" />
          </Link>
          <DeleteApplicationButton
            id={application.id}
            status={application.latest_status}
            name={application.answers.name || "Без имени"}
            compact
          />
        </div>
      </footer>
    </article>
  );
}
