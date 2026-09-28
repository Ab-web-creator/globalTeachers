import type { Answers } from "./form-fields";
import ChoiceField from "./choice-field";
import RadioField from "./radio-field";

const questions: { name: keyof Answers; label: string; options: string[]; multiple?: boolean }[] = [
  {
    name: "english",
    label: "Как вы оцениваете свой уровень английского?",
    options: [
      "Не говорю по-английски",
      "Базовый — могу общаться на простые темы",
      "Средний — могу поддерживать разговор",
      "Уверенный — могу работать на английском",
      "Свободный",
    ],
  },
  { name: "timing", label: "Когда вы хотели бы начать работу за рубежом?", options: ["Как можно скорее", "В следующем учебном году", "Через 1–2 года", "Пока изучаю возможности"] },
  { name: "destinations", label: "Какие страны или регионы вы рассматриваете?", options: ["Азия", "Ближний Восток", "Европа", "Другие регионы", "Открыт(а) к разным вариантам"], multiple: true },
  { name: "priority", label: "Что для вас сейчас самое важное?", options: ["Понять свои шансы", "Выбрать страны и школы", "Найти вакансии", "Подготовить CV и портфолио", "Подготовиться к интервью", "Получить сопровождение до оффера"] },
];

export default function PlansFields({ names, answers, onChange }: { names: readonly string[]; answers: Answers; onChange: (name: keyof Answers, value: string) => void }) {
  return (
    <>
      {questions.filter((question) => names.includes(question.name)).map((question) => {
        const Field = question.name === "english" ? RadioField : ChoiceField;
        return <Field key={question.name} {...question} value={answers[question.name]} onChange={(value) => onChange(question.name, value)} />;
      })}
      {names.includes("goals") && <label htmlFor="consultation-goals" className="block text-sm font-medium">
        <span className="sr-only">Расскажите немного о своей ситуации (необязательно)</span>
        <textarea id="consultation-goals" name="goals" aria-describedby="step-description" value={answers.goals} onChange={(event) => onChange("goals", event.target.value)} rows={8} maxLength={1500} placeholder="Например: где вы сейчас работаете, какую работу ищете или какие вопросы хотели бы обсудить." className="block w-full resize-y rounded-xl border border-brand-200 bg-white/80 px-4 py-3 text-base font-normal text-brand-700 placeholder:text-neutral-400 focus:border-brand-500 focus:outline-1 focus:-outline-offset-2 focus:outline-brand-300" />
      </label>}
    </>
  );
}
