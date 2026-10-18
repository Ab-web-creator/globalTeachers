"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
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
  const t = useTranslations();
  return (
    <>
      {questions.filter((question) => names.includes(question.name)).map((question) => {
        return <ChoiceField key={question.name} {...question} value={answers[question.name]} onChange={(value) => onChange(question.name, value)} />;
      })}
      {names.includes("packagePreference") && <ChoiceField name="packagePreference" label={t("consultation.plansFields.message0581")} options={["Start", "Pro", "VIP", { value: "", label: "Пока не выбираю" }]} value={answers.packagePreference} required={false} onChange={(value) => onChange("packagePreference", value)} />}
    </>
  );
}
