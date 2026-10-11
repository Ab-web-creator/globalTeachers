"use client";

import { useEffect, useRef, useState } from "react";
import type { Answers } from "./form-fields";
import ChoiceField from "./choice-field";
import SubjectSelector from "./subject-selector";
import { educationNotice } from "./education-notice";

const questions: { name: keyof Answers; label: string; options: string[] }[] = [
  { name: "education", label: "Ваше образование", options: ["Среднее специальное", "Бакалавр", "Магистр", "Докторская степень", "Профессор"] },
  { name: "qualification", label: "Есть ли у вас педагогическая квалификация?", options: ["Есть BEd/MEd", "Есть QTS, PGCE", "Нет"] },
];

export default function ExperienceFields({ names, answers, onChange }: { names: readonly string[]; answers: Answers; onChange: (name: keyof Answers, value: string) => void }) {
  const [noticeOpen, setNoticeOpen] = useState<"qualification" | "education" | null>(null);
  const notice = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (noticeOpen && !notice.current?.open) notice.current?.showModal();
  }, [noticeOpen]);

  return (
    <>
      {names.includes("subject") && <SubjectSelector value={answers.subject} onChange={(value) => onChange("subject", value)} />}
      {questions.filter((question) => names.includes(question.name)).map((question) => <ChoiceField key={question.name} {...question} value={answers[question.name]} onChange={(value) => { onChange(question.name, value); if (question.name === "qualification" && value === "Нет") setNoticeOpen("qualification"); if (question.name === "education" && value === "Среднее специальное") setNoticeOpen("education"); }} />)}
      <dialog ref={notice} onClose={() => setNoticeOpen(null)} aria-labelledby="qualification-notice-title" className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-3xl bg-white p-6 text-brand-700 shadow-xl backdrop:bg-brand-950/50 sm:p-8">
        <h3 id="qualification-notice-title" className="text-xl font-semibold">{noticeOpen === "education" ? educationNotice.title : "Педагогическая квалификация"}</h3>
        <p className="mt-7 text-base leading-relaxed">{noticeOpen === "education" ? educationNotice.reason : "Педагогическая квалификация — обязательное требование практически во всех международных школах. Её отсутствие существенно ограничивает возможности трудоустройства."}</p>
        <p className="mt-4 text-base leading-relaxed">{noticeOpen === "education" ? educationNotice.recommendation : <>Рекомендуем программу <strong>START</strong>, чтобы оценить ваши перспективы и определить возможные пути получения необходимой квалификации.</>}</p>
        <button type="button" onClick={() => notice.current?.close()} className="mt-6 rounded-xl bg-brand-500 px-5 py-3 font-medium text-white hover:bg-brand-600">Продолжить заполнение</button>
      </dialog>
    </>
  );
}
