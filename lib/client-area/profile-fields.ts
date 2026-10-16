import type { Answers } from "../../app/consultation/components/form-fields";

export const profileLabels: Record<keyof Answers, string> = {
  name: "Имя и фамилия", email: "Email", country: "Страна проживания",
  subject: "Специализация", education: "Образование", english: "Уровень английского",
  qualification: "Педагогическая квалификация", packagePreference: "Интересующая программа",
  contact: "WhatsApp / Telegram", goals: "Ситуация и вопросы",
};
const requiredFields: (keyof Answers)[] = ["name", "email", "country", "subject", "education", "english", "qualification"];
export function missingProfileFields(answers: Answers) {
  return requiredFields.filter(field => !answers[field]?.trim()).map(field => profileLabels[field]);
}

export function emptyClientProfile(): Answers {
  return Object.fromEntries(Object.keys(profileLabels).map(field => [field, ""])) as Answers;
}
