import LocalTime from "./local-time";
import type { Application, ApplicationAttempt } from "../../../lib/admin/applications";
import { consultationSteps } from "../../consultation/components/consultation-steps";
import { answerLabels } from "../../../lib/consultation/answers";

const attemptStatuses: Record<ApplicationAttempt["status"], string> = {
  draft: "Незавершённая форма",
  pending: "Ожидает подтверждения",
  confirmed: "Подтверждена",
  superseded: "Заменена новой попыткой",
  expired: "Срок подтверждения истёк",
};

export default function ApplicationDetails({ application }: { application: Application }) {
  return (
    <>
      <p className="mb-5 text-xs leading-relaxed text-neutral-500">
        {application.email_confirmed_at ? <>Email подтверждён: <LocalTime value={application.email_confirmed_at.toISOString()} /></> : application.expires_at ? <>Срок подтверждения: <LocalTime value={application.expires_at.toISOString()} /></> : null}
        {application.latest_status === "confirmed" && <span className="mt-1 block">Письмо команде: {application.notification_sent_at ? "отправлено" : "ещё не отправлено"}</span>}
      </p>
      {application.qualification_changes.length > 0 && <aside aria-label="Изменения педагогической квалификации" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
        <p className="font-semibold">⚠ Данный юзер изменил свой ответ о педагогической квалификации</p>
        <ul className="mt-3 space-y-2 text-sm">
          {application.qualification_changes.map((change, index) => <li key={index}>
            <span className="font-medium">{change.previous_answer} → {change.new_answer}</span>
            <LocalTime value={change.changed_at} className="ml-2 text-xs" />
          </li>)}
        </ul>
      </aside>}
      {application.answer_changes.length > 0 && <aside aria-label="Изменения ответов" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
        <p className="font-semibold">⚠ Данный юзер изменил свои ответы о предметах, образовании или уровне английского</p>
        <ul className="mt-3 space-y-2 text-sm">
          {application.answer_changes.map((change, index) => <li key={index}>
            <span className="font-medium">{answerLabels[change.field]}: {change.previous_answer} → {change.new_answer || "Не указано"}</span>
            <LocalTime value={change.changed_at} className="ml-2 text-xs" />
          </li>)}
        </ul>
      </aside>}
      <h3 className="text-base font-semibold">История ответов</h3>
      <p className="mt-2 text-xs leading-relaxed text-neutral-500">Исходные ответы каждой попытки. Изменения относительно предыдущей попытки выделены цветом. Редактирование заявки не меняет историю.</p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-brand-100">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">Сравнение ответов по попыткам для {application.email}</caption>
          <thead>
            <tr className="bg-brand-50">
              <th scope="col" className="min-w-40 p-3 align-top font-medium">Поле</th>
              {application.attempts.map((attempt, index) => (
                <th key={attempt.id} scope="col" className="min-w-56 p-3 align-top font-medium">
                  <span className="block">{index + 1}-я попытка</span>
                  <LocalTime value={attempt.submitted_at} className="mt-1 block text-xs font-normal text-neutral-500" />
                  <span className="mt-1 block text-xs font-normal">{attemptStatuses[attempt.status]}</span>
                  {attempt.status === "draft" && attempt.last_step && <span className="mt-1 block text-xs font-normal text-neutral-500">Последний шаг: {consultationSteps.find((step) => step.fields[0] === attempt.last_step)?.title}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(answerLabels).filter(([key]) => (key !== "goals" && key !== "contact") || application.attempts.some((attempt) => attempt.answers[key as keyof typeof attempt.answers]?.trim())).map(([key, label]) => (
              <tr key={key} className="border-t border-brand-100">
                <th scope="row" className="p-3 align-top font-medium text-neutral-500">{label}</th>
                {application.attempts.map((attempt, index) => {
                  const field = key as keyof typeof attempt.answers;
                  const value = attempt.answers[field] || "";
                  const previous = index > 0 ? application.attempts[index - 1].answers[field] || "" : value;
                  const changed = value !== previous;
                  return (
                    <td key={attempt.id} className={`p-3 align-top whitespace-pre-wrap break-words ${changed ? "bg-amber-50 text-amber-900" : ""}`}>
                      {changed && <span className="mb-1 block text-xs font-medium">Изменено</span>}
                      {value || (key === "packagePreference" ? "Не выбрана" : "Не указано")}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
