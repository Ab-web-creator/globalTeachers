import type { Answers } from "./form-fields";
import ChoiceField from "./choice-field";
import SubjectSelector from "./subject-selector";

const questions: { name: keyof Answers; label: string; options: string[] }[] = [
  { name: "experience", label: "Ваш педагогический стаж", options: ["До 2 лет", "2–5 лет", "5–10 лет", "Более 10 лет"] },
  { name: "education", label: "Ваше образование", options: ["Бакалавр", "Магистр", "Докторская степень", "Другое"] },
  { name: "qualification", label: "Есть ли у вас педагогическая квалификация?", options: ["Да", "Нет", "Не уверен(а)"] },
  { name: "international", label: "Есть ли у вас опыт работы в международной школе?", options: ["Да", "Нет"] },
];

export default function ExperienceFields({ answers, onChange }: { answers: Answers; onChange: (name: keyof Answers, value: string) => void }) {
  return (
    <div className="space-y-6">
      <SubjectSelector value={answers.subject} onChange={(value) => onChange("subject", value)} />
      {questions.map((question) => <ChoiceField key={question.name} {...question} value={answers[question.name]} onChange={(value) => onChange(question.name, value)} />)}
    </div>
  );
}
