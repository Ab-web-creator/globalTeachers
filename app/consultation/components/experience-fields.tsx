"use client";

import type { Answers } from "./form-fields";
import ChoiceField from "./choice-field";
import SubjectSelector from "./subject-selector";

const questions: { name: keyof Answers; label: string; options: string[] }[] = [
  { name: "education", label: "Ваше образование", options: ["Среднее специальное", "Бакалавр", "Магистр", "Докторская степень", "Профессор"] },
  { name: "qualification", label: "Есть ли у вас педагогическая квалификация?", options: ["Есть BEd/MEd", "Есть QTS, PGCE", "Нет"] },
];

export default function ExperienceFields({ names, answers, onChange }: { names: readonly string[]; answers: Answers; onChange: (name: keyof Answers, value: string) => void }) {
  return (
    <>
      {names.includes("subject") && <SubjectSelector value={answers.subject} onChange={(value) => onChange("subject", value)} />}
      {questions.filter((question) => names.includes(question.name)).map((question) => <ChoiceField key={question.name} {...question} value={answers[question.name]} onChange={(value) => onChange(question.name, value)} />)}
    </>
  );
}
