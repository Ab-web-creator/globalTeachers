import type { Answers } from "./form-fields";
import ChoiceField from "./choice-field";
import SubjectSelector from "./subject-selector";
import InternationalExperienceField from "./international-experience-field";

const questions: { name: keyof Answers; label: string; options: string[] }[] = [
  { name: "experience", label: "Ваш педагогический стаж", options: ["Нет стажа", "До 2 лет", "2–5 лет", "5–10 лет", "Более 10 лет"] },
  { name: "education", label: "Ваше образование", options: ["Среднее специальное", "Бакалавр", "Магистр", "Докторская степень", "Профессор"] },
  { name: "qualification", label: "Есть ли у вас педагогическая квалификация?", options: ["Да", "Нет", "Не уверен(а)"] },
];

export default function ExperienceFields({ names, answers, onChange }: { names: readonly string[]; answers: Answers; onChange: (name: keyof Answers, value: string) => void }) {
  return (
    <>
      {names.includes("subject") && <SubjectSelector value={answers.subject} onChange={(value) => onChange("subject", value)} />}
      {names.includes("international") && <InternationalExperienceField value={answers.international} onChange={(value) => onChange("international", value)} />}
      {questions.filter((question) => names.includes(question.name)).map((question) => <ChoiceField key={question.name} {...question} value={answers[question.name]} onChange={(value) => onChange(question.name, value)} />)}
    </>
  );
}
