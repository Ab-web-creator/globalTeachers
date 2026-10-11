import type { Answers } from "../../app/consultation/components/form-fields";
import { MAX_SUBJECTS, subjects } from "../../app/consultation/components/subjects";

export const answerLabels: Record<keyof Answers, string> = { name: "Имя", country: "Страна проживания", email: "Email", contact: "WhatsApp / Telegram", subject: "Специализация", education: "Образование", qualification: "Педагогическая квалификация", english: "Уровень английского", packagePreference: "Интересующая программа", goals: "Ситуация и вопросы (ранее)" };

export class AnswerValidationError extends Error {
  constructor(public field: keyof Answers, message: string) {
    super(message);
    this.name = "AnswerValidationError";
  }
}

export function parseAnswers(input: unknown): Answers {
  if (!input || typeof input !== "object") throw new Error("Invalid application");
  const data = input as Record<string, unknown>;
  const result: Record<string, string> = {};
  for (const key of Object.keys(answerLabels) as (keyof Answers)[]) {
    const value = (key === "packagePreference" || key === "goals") ? data[key] ?? "" : data[key];
    const limit = key === "subject" ? 6000 : key === "goals" ? 1500 : 300;
    if (typeof value !== "string") throw new AnswerValidationError(key, `Проверьте поле «${answerLabels[key]}».`);
    if (value.length > limit) throw new AnswerValidationError(key, `Поле «${answerLabels[key]}» должно содержать не более ${limit} символов.`);
    result[key] = value.trim();
    if (!result[key] && key !== "goals" && key !== "contact" && key !== "packagePreference") throw new AnswerValidationError(key, `Заполните поле «${answerLabels[key]}».`);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email) || /[\r\n]/.test(result.email)) throw new AnswerValidationError("email", "Укажите корректный email, например name@example.com.");
  if (result.subject.split("; ").length > MAX_SUBJECTS) throw new AnswerValidationError("subject", `Выберите не более ${MAX_SUBJECTS} предметов.`);
  if (!result.subject.split("; ").every((subject) => subjects.includes(subject))) throw new AnswerValidationError("subject", "Выберите предметы из списка заново: один из выбранных вариантов недоступен.");
  if (!["", "Start", "Pro", "VIP"].includes(result.packagePreference)) throw new AnswerValidationError("packagePreference", "Выберите Start, Pro, VIP или оставьте выбор на потом.");
  return result as Answers;
}

export function summarize(answers: Answers) {
  return Object.entries(answerLabels).filter(([key]) => (key !== "goals" && key !== "contact") || answers[key as keyof Answers]?.trim()).map(([key, label]) => `${label}: ${answers[key as keyof Answers] || "Не указано"}`).join("\n");
}
