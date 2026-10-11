"use client";

import { useEffect, useRef, useState } from "react";
import { englishNotice, isBeginnerEnglish } from "./english-notice";
import type { Answers } from "./form-fields";
import ChoiceField from "./choice-field";

const questions: { name: keyof Answers; label: string; options: string[] }[] = [
  {
    name: "english",
    label: "Как вы оцениваете свой уровень английского?",
    options: [
      "Не говорю по-английски",
      "Базовый — могу общаться на простые темы",
      "Средний — могу поддерживать разговор",
      "Уверенный — могу работать на английском",
    ],
  },
];

export default function PlansFields({ names, answers, onChange }: { names: readonly string[]; answers: Answers; onChange: (name: keyof Answers, value: string) => void }) {
  const [noticeOpen, setNoticeOpen] = useState(false);
  const notice = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (noticeOpen && !notice.current?.open) notice.current?.showModal();
  }, [noticeOpen]);
  return (
    <>
      {questions.filter((question) => names.includes(question.name)).map((question) => {
        return <ChoiceField key={question.name} {...question} value={answers[question.name]} onChange={(value) => { onChange(question.name, value); if (question.name === "english" && isBeginnerEnglish(value)) setNoticeOpen(true); }} />;
      })}
      {names.includes("packagePreference") && <ChoiceField name="packagePreference" label="Какая программа вас интересует?" options={["Start", "Pro", "VIP", { value: "", label: "Пока не выбираю" }]} value={answers.packagePreference} required={false} onChange={(value) => onChange("packagePreference", value)} />}
      <dialog ref={notice} onClose={() => setNoticeOpen(false)} aria-labelledby="english-notice-title" className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-3xl bg-white p-6 text-brand-700 shadow-xl backdrop:bg-brand-950/50 sm:p-8">
        <h3 id="english-notice-title" className="text-xl font-semibold">{englishNotice.title}</h3>
        <p className="mt-7 text-base leading-relaxed">{englishNotice.reason}</p>
        <p className="mt-4 text-base leading-relaxed">{englishNotice.recommendation}</p>
        <button type="button" onClick={() => notice.current?.close()} className="mt-6 rounded-xl bg-brand-500 px-5 py-3 font-medium text-white hover:bg-brand-600">Продолжить заполнение</button>
      </dialog>
    </>
  );
}
